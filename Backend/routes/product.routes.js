const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const {
  productValidator,
  productIdValidator,
} = require("../validators/product.validator");

const router = express.Router();


// CREATE PRODUCT - Login required
router.post(
  "/",
  authenticate,
  productValidator,
  validate,
  createProduct
);


// GET ALL PRODUCTS - Public
router.get(
  "/",
  getProducts
);


// GET SINGLE PRODUCT - Public
router.get(
  "/:id",
  productIdValidator,
  validate,
  getProductById
);


// UPDATE PRODUCT - Login required
router.put(
  "/:id",
  authenticate,
  productIdValidator,
  productValidator,
  validate,
  updateProduct
);


// DELETE PRODUCT - Login required
router.delete(
  "/:id",
  authenticate,
  productIdValidator,
  validate,
  deleteProduct
);


module.exports = router;