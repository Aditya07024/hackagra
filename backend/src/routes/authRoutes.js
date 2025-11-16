const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @body { username, email, password, role? }
 * @access Public
 */
router.post("/register", authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @body { email, password }
 * @access Public
 */
router.post("/login", authController.login);

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get("/me", authenticate, authController.getMe);

module.exports = router;

