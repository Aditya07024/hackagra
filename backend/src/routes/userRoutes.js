const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

/**
 * @route POST /api/users/create
 * @desc Create a new user
 * @body { username, email, password }
 */
router.post("/create", userController.createUser);

/**
 * @route GET /api/users/:userId
 * @desc Get user by ID with their files
 */
router.get("/:userId", userController.getUser);

/**
 * @route GET /api/users/leaderboard
 * @desc Get leaderboard data
 */
router.get("/leaderboard", userController.getLeaderboard);

/**
 * @route GET /api/users/dashboard/stats
 * @desc Get dashboard statistics
 */
router.get("/dashboard/stats", userController.getDashboardStats);

/**
 * @route GET /api/users/planner
 * @desc Get planner data
 */
router.get("/planner", userController.getPlannerData);

/**
 * @route GET /api/users/seniors
 * @desc Get all active senior profiles
 */
router.get("/seniors", userController.getSeniors);

/**
 * @route PUT /api/users/senior-profile
 * @desc Update user's senior profile
 * @body { seniorTitle, seniorDescription, profilePictureUrl }
 */
router.put("/senior-profile", protect, userController.updateSeniorProfile);

/**
 * @route PUT /api/users/:userId/details
 * @desc Update user's general details
 * @body { username, rollNumber, dateOfBirth, gender, address, phoneNumber, tenthMarks, twelfthMarks, course, university, linkedinProfile, githubProfile, portfolioWebsite }
 */
router.put("/:userId/details", userController.updateUserDetails);

module.exports = router;
