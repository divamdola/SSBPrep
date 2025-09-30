const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  newTest,
  getTest,
  updateTest,
  deleteTest,
  submitTest,
  getResult,
  getMyAttempts,
  pauseTest
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles }=require('../middlewares/auth');

router.route("/products").get(getProducts);

router.route("/test").get(getTest);

router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles('admin'),newProduct);

router.route("/product/:id").get(getSingleProduct);

router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRoles('admin'),updateProduct).delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct);

router.route("/admin/test/new").post(isAuthenticatedUser,authorizeRoles('admin'),newTest);

router.route("/admin/test/:id").put(isAuthenticatedUser,authorizeRoles('admin'),updateTest).delete(isAuthenticatedUser,authorizeRoles('admin'),deleteTest);

router.route("/test/submit/:id").post(isAuthenticatedUser, submitTest);

router.route("/test/result/:test_id").get(isAuthenticatedUser, getResult);

router.route("/test/my-attempts").get(isAuthenticatedUser, getMyAttempts);

router.post("/pause", pauseTest);

module.exports = router;
