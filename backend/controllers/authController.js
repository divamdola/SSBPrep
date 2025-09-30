const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const sendToken = require("../utils/jwtToken");

const sendEmail = require("../utils/sendEmail");


const crypto = require("crypto");
//Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 200, res);
});


//Login User => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;

  //checks if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password"), 400);
  }

  //Finding User in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  //Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});

//Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // //Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // //Create reset password URL
  // const resetUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/password/reset/${resetToken}`;
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow :\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "SSBPrep Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Password reset token is invalid or has expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  //Setup new Password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//Get Currently logged in user details => /api/v1/me
exports.getUserProfile=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
});

// Update Password => /api/v1/password/update
exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select('+password');

    //Check previous user password
    const isMatched=await user.comparePassword(req.body.oldpassword);

    if(!isMatched){
        return next(new ErrorHandler('Old Password does not match',400));
    }

    user.password=req.body.password;
    await user.save();

    sendToken(user,200,res)
})

//Update User Profile => /api/v1/me/update
exports.updateProfile=catchAsyncErrors(async (req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email
    }

    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        user
    })
})

//Logout User => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {

res.cookie("token", null, {
  expires: new Date(Date.now()),
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true in prod
  sameSite: "None", // ✅ Allow cross-site
});


  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});


//Admin Routes

//Get all users(admin) => /api/v1/admin/users
exports.allUsers=catchAsyncErrors(async(req,res,next)=>{
    const users=await User.find();

    res.status(200).json({
        success:true,
        users
    })
})

//Get specific user(admin) details => /api/v1/admin/user/:id
exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not found with id : ${req.params.id}`),401);
    }

    res.status(200).json({
        success:true,
        user
    })
})

//Update User(Admin) Profile => /api/v1/admin/user/:id
exports.updateUser=catchAsyncErrors(async (req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        user
    })
})

//Delete specific user details => /api/v1/admin/user/:id
exports.deleteUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not found with id : ${req.params.id}`),401);
    }

    await user.deleteOne();

    res.status(200).json({
        success:true
    })
})