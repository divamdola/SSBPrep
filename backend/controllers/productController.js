const Product = require("../models/product");
const Test=require("../models/test");
// const TestAttempt = require("../models/TestAttempt");
const TestAttempt = require("../models/testAttempt");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

//Create new product  => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//Create new test => /api/v1/admin/test/new
exports.newTest=catchAsyncErrors(async(req,res,next)=>{
  const test=await Test.create(req.body);

  res.status(201).json({
    success:true,
    test,
  })
});

//Get all products => /api/v1/products?category=cds
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const products = await Product.find();

    if (!products.length) {
      return res.status(404).json({ success: false, message: "No books found" });
    }

    // Group books by category
    const booksByCategory = products.reduce((acc, book) => {
      if (!acc[book.category]) {
        acc[book.category] = [];
      }
      acc[book.category].push(book);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: products.length,
      booksByCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Get all Tests => /api/v1/test?category=CDS
exports.getTest = catchAsyncErrors(async (req, res, next) => {
  try {
    const { category } = req.query;
    let tests;

    if (category) {
      // Fetch tests only for the given category
      tests = await Test.find({ category: category.toUpperCase() });

      if (!tests.length) {
        return res.status(404).json({ success: false, message: "No tests found for this category" });
      }
      
      return res.status(200).json({
        success: true,
        count: tests.length,
        tests,
      });
    }

    // If no category is provided, fetch all tests
    tests = await Test.find();

    if (!tests.length) {
      return res.status(404).json({ success: false, message: "No tests found" });
    }

    // Group tests by category
    const groupedTests = tests.reduce((acc, test) => {
      if (!acc[test.category]) {
        acc[test.category] = [];
      }
      acc[test.category].push(test);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: tests.length,
      groupedTests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

exports.pauseTest = async (req, res, next) => {
  try {
    const { testId, timeLeft, answers, currentQuestionIndex } = req.body;
    const userId = req.user._id; // Always use authenticated user

    // Find or create a TestAttempt for this user/test
    let attempt = await TestAttempt.findOne({ test: testId, user: userId });
    if (!attempt) {
      attempt = new TestAttempt({
        test: testId,
        user: userId,
        answers: [],
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        timeTaken: 0,
      });
    }

    // Update with paused data
    attempt.answers = answers;
    attempt.timeTaken = (attempt.test?.timeDuration * 60 || 0) - timeLeft;
    attempt.paused = true;
    attempt.currentQuestionIndex = currentQuestionIndex;
    await attempt.save();

    res.status(200).json({ success: true, attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit test answers and get score => /api/v1/test/submit/:id
exports.submitTest = catchAsyncErrors(async (req, res, next) => {
  const testId = req.params.id;
  const { answers, timeTaken } = req.body;
  const userId = req.user._id;

  // 1. Find test
  const test = await Test.findById(testId);
  if (!test) {
    return next(new ErrorHandler("Test not found", 404));
  }

  // 2. Validate answers
  if (!Array.isArray(answers) || answers.length !== test.questions.length) {
    return next(new ErrorHandler("Invalid answers format or count", 400));
  }

  // Validate each answer has required fields
  const isValidAnswers = answers.every(answer => 
    answer.question && 
    typeof answer.selectedOption === 'string' &&
    typeof answer.isCorrect === 'boolean'
  );

  if (!isValidAnswers) {
    return next(new ErrorHandler("Invalid answer format. Each answer must have question, selectedOption, and isCorrect fields", 400));
  }

  // 3. Calculate score
  let score = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let notAttempted = 0;

  answers.forEach(answer => {
    if (answer.selectedOption === "Not Attempted") {
      notAttempted++;
    } else if (answer.isCorrect) {
      score += test.marksCorrect;
      correctAnswers++;
    } else {
      score -= test.marksWrong;
      wrongAnswers++;
    }
  });

  // Round score to 2 decimal places
  score = Number(score.toFixed(2));

  // 4. Save attempt
  const attempt = await TestAttempt.create({
    user: userId,
    test: testId,
    answers,
    score,
    totalQuestions: test.questions.length,
    correctAnswers,
    wrongAnswers,
    timeTaken,
  });

  // 5. Return result
  res.status(200).json({
    success: true,
    message: "Test submitted successfully",
    attempt,
  });
});

//Get Result of the test =>/api/v1/test/result/:test_id
exports.getResult = catchAsyncErrors(async (req, res, next) => {
  // Get the current user's result
  const result = await TestAttempt.findOne({
    test: req.params.test_id,
    user: req.user._id
  }).populate('test');

  if (!result) {
    return next(new ErrorHandler("Result not found. The test might not have been submitted yet.", 404));
  }

  // Get all attempts for this test to calculate statistics
  const allAttempts = await TestAttempt.find({ test: req.params.test_id })
    .select('score timeTaken correctAnswers wrongAnswers')
    .sort({ score: -1 }); // Sort by score in descending order

  // Calculate statistics
  const totalAttempts = allAttempts.length;
  const averageScore = Number((allAttempts.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts).toFixed(2));
  const averageTime = Math.round(allAttempts.reduce((acc, curr) => acc + curr.timeTaken, 0) / totalAttempts);
  
  // Get topper's score
  const topperScore = allAttempts[0]?.score || 0;
  
  // Find user's rank
  const userRank = allAttempts.findIndex(attempt => attempt.score === result.score) + 1;

  // Calculate average attempts
  const averageStats = {
    correctAnswers: Math.round(allAttempts.reduce((acc, curr) => acc + (curr.correctAnswers || 0), 0) / totalAttempts),
    wrongAnswers: Math.round(allAttempts.reduce((acc, curr) => acc + (curr.wrongAnswers || 0), 0) / totalAttempts)
  };

  // Get topper's stats
  const topperAttempt = await TestAttempt.findOne({ test: req.params.test_id })
    .sort({ score: -1 })
    .select('correctAnswers wrongAnswers timeTaken');

  res.status(200).json({
    success: true,
    result,
    stats: {
      totalAttempts,
      userRank,
      average: {
        score: averageScore,
        correctAnswers: averageStats.correctAnswers,
        wrongAnswers: averageStats.wrongAnswers,
        timeTaken: averageTime
      },
      topper: {
        score: Number(topperScore.toFixed(2)),
        correctAnswers: topperAttempt.correctAnswers,
        wrongAnswers: topperAttempt.wrongAnswers,
        timeTaken: topperAttempt.timeTaken
      }
    }
  });
});

// Get user's attempted tests => /api/v1/test/my-attempts
exports.getMyAttempts = catchAsyncErrors(async (req, res, next) => {
  const attempts = await TestAttempt.find({ user: req.user._id }).select("test _id score");

  res.status(200).json({
    success: true,
    attempts,
  });
});

//Get single product detail => /api/v1/product/:category
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//Update product  => /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//Update test  => /api/v1/admin/test/:id
exports.updateTest = catchAsyncErrors(async (req, res, next) => {
  let tests = await Test.findById(req.params.id);

  if (!tests) {
    return next(new ErrorHandler("Test not found", 400));
  }

  tests = await Test.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    tests,
  });
});

//Delete Product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  await product.deleteOne(); // Updated method
  res.status(200).json({
    success: true,
    message: "Product is deleted",
  });
});


//Delete Test => /api/v1/admin/test/:id
exports.deleteTest = catchAsyncErrors(async (req, res, next) => {
  const tests = await Test.findById(req.params.id);

  if (!tests) {
    return next(new ErrorHandler("Test not found", 400));
  }

  await tests.deleteOne(); // Updated method
  res.status(200).json({
    success: true,
    message: "Test is deleted",
  });
});