const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
} = require("../controllers/auth.controller");

const router = express.Router();
const validate = require("../middleware/validation.middleware");

const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");

router.post(
  "/register",
  registerValidator,
  validate,
  register
);
router.post(
  "/login",
  loginValidator,
  validate,
  login
);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

module.exports = router;