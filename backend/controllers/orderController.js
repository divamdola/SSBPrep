const Order=require('../models/order');

const Product=require('../models/product');

const ErrorHandler=require('../utils/errorHandler');
const catchAsyncErrors=require('../middlewares/catchAsyncErrors');


//Create a new order => /api/v1/order/new
exports.newOrder=catchAsyncErrors(async(req,res,next)=>{
    const { 
        orderItems,
        totalPrice,
        paymentInfo
    }=req.body;
    
    const order=await Order.create({
        orderItems,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user:req.user._id
    })

    res.status(200).json({
        success:true,
        order
    })
})