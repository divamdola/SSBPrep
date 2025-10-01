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

exports.pauseTest = async (req, res) => {
  try {
    const { testId, timeLeft, answers, currentQuestionIndex } = req.body;
    const userId = req.user?._id; // Assuming user is available from auth middleware

    if (!userId) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const attempt = await TestAttempt.findOneAndUpdate(
      { test: testId, user: userId },
      {
        $set: { 
          timeLeft, 
          currentQuestionIndex, 
          inProgressAnswers: answers, // Use the new field
          paused: true 
        },
      },
      { new: true, upsert: true } // Creates a new attempt if one doesn't exist
    );

    res.status(200).json({ success: true, attempt });
  } catch (error) {
    console.error("PauseTest Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




exports.getResult = catchAsyncErrors(async (req, res, next) => {
  const result = await TestAttempt.findOne({ test: req.params.test_id, user: req.user._id }).populate("test");

  if (!result) {
    return next(new ErrorHandler("Result not found", 404));
  }

  res.status(200).json({
    success: true,
    result,
  });
});

exports.resumeTest = async (req, res) => {
  try {
    const { testId } = req.body;
    const userId = req.user._id;

    let attempt = await TestAttempt.findOne({ test: testId, user: userId });

    if (!attempt || !attempt.paused) {
      return res.status(404).json({ success: false, message: "No paused attempt found for this test." });
    }
    
    // Optional: You might not want to set paused to false here.
    // See the discussion in the previous response about UX improvements.
    // For now, this logic matches the original intent.
    attempt.paused = false;
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

  const isValidAnswers = answers.every(
    (answer) =>
      answer.question &&
      typeof answer.selectedOption === "string" &&
      typeof answer.isCorrect === "boolean"
  );

  if (!isValidAnswers) {
    return next(
      new ErrorHandler(
        "Invalid answer format. Each answer must have question, selectedOption, and isCorrect fields",
        400
      )
    );
  }

  // 3. Calculate score
  let score = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let notAttempted = 0;

  answers.forEach((answer) => {
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

  score = Number(score.toFixed(2));

  // 4. Find existing attempt (paused or already created)
  let attempt = await TestAttempt.findOne({ user: userId, test: testId });

  if (!attempt) {
    // First time submission → create
    attempt = new TestAttempt({
      user: userId,
      test: testId,
    });
  }

  // Always overwrite with final submission data
  attempt.answers = answers;
  attempt.score = score;
  attempt.totalQuestions = test.questions.length;
  attempt.correctAnswers = correctAnswers;
  attempt.wrongAnswers = wrongAnswers;
  attempt.timeTaken = timeTaken;
  attempt.paused = false; // 👈 clear pause flag
  attempt.timeLeft = 0;   // 👈 reset leftover time
  attempt.currentQuestionIndex = 0;

  await attempt.save();

  res.status(200).json({
    success: true,
    message: "Test submitted successfully",
    attempt,
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