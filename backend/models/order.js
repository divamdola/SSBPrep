const mongoose=require('mongoose');

const orderSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    orderItems:[
        {
            title:{
                type:String,
                required:true
            },
            images:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'Product'
            }
        }
    ],
    totalPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    paymentInfo:{
        id:{
            type:String
        },
        status:{
            type:String
        }
    },
    paidAt:{
        type:Date
    }
})

module.exports=mongoose.model('Order',orderSchema);