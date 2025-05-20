const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  examName:{
    type:String,
    required:[true,"Please enter Exam name"]
  },
  price: {
    type: Number,
    trim: true,
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      pdfUrl:{
        type:String,
        required:[true, "Please provide the PDF Url"]
      }
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter name of Exam"],
  },
  type:{
    type:String,
    required:[true,"Please Enter type of Book"]
  }
});

module.exports = mongoose.model("Product", productSchema);
