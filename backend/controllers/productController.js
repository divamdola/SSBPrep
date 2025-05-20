const Product = require("../models/product");
const Test=require("../models/test");
const TestAttempt=require("../models/testAttempt");
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

// Submit test answers and get score => /api/v1/test/submit/:id
exports.submitTest = async (req, res) => {
  try {
    const { testId, answers, timeTaken } = req.body;
    const userId = req.user.id; // assumed from auth middleware

    console.log("User ID:", userId);
    // 1. Find test
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    // 2. Validate answers length
    if (!Array.isArray(answers) || answers.length !== test.questions.length) {
      return res.status(400).json({
        success: false,
        message: "Answers count does not match questions count",
      });
    }
    // 3. Calculate score
    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    const detailedAnswers = test.questions.map((q, index) => {
      const selectedOption = answers[index];
      const isCorrect = selectedOption === q.answer;

      if (isCorrect) {
        score += test.marksCorrect;
        correctAnswers++;
      } else if (selectedOption) {
        score -= test.marksWrong;
        wrongAnswers++;
      }

      return {
        question: q.questionText,
        selectedOption,
        isCorrect,
      };
    });

    // 4. Save attempt
    const attempt = await TestAttempt.create({
      user: userId,
      test: testId,
      answers: detailedAnswers,
      score,
      totalQuestions: test.questions.length,
      correctAnswers,
      wrongAnswers,
      timeTaken,
    }).catch((err) => {
      console.error("Error saving TestAttempt:", err);
      throw err;
    });
    

    // 5. Return result
    res.status(200).json({
      success: true,
      message: "Test submitted successfully",
      attempt,
    });

  } catch (error) {
    console.error("Error submitting test:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Get Result of the test =>/api/v1/test/result/:test_id
exports.getResult = catchAsyncErrors(async (req, res, next) => {
  // const result = await TestAttempt.findOne({
  //   test: req.params.test_id,
  //   user: req.user._id, // Make sure user is authenticated
  // });
  const result = await TestAttempt.findOne({ test: req.params.test_id, user: req.user._id }).populate("test");

  if (!result) {
    return next(new ErrorHandler("Result not found", 404));
  }

  res.status(200).json({
    success: true,
    result,
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