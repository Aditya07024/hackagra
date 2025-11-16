const { User } = require("../models/index");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Register a new user
 * @route POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "username, email, and password are required",
      });
    }

    // Validate role
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "role must be either 'user' or 'admin'",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user with role (default to 'user' if not provided)
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          // Personal Details
          rollNumber: user.rollNumber,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address,
          phoneNumber: user.phoneNumber,
          // Educational Details
          tenthMarks: user.tenthMarks,
          twelfthMarks: user.twelfthMarks,
          course: user.course,
          university: user.university,
          // Social Media Links
          linkedinProfile: user.linkedinProfile,
          githubProfile: user.githubProfile,
          portfolioWebsite: user.portfolioWebsite,
          // Senior Profile Details
          isSeniorProfileActive: user.isSeniorProfileActive,
          seniorSubjects: user.seniorSubjects,
          seniorDescription: user.seniorDescription,
          profilePictureUrl: user.profilePictureUrl,
          availability: user.availability,
          connectionLink: user.connectionLink,
          averageRating: user.averageRating, // Include averageRating
          sessionsTaken: user.sessionsTaken,
          sessionsAttended: user.sessionsAttended,
        },
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "role is required",
      });
    }

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "role must be either 'user' or 'admin'",
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify role matches
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Invalid role. This account is registered as a ${user.role}, not a ${role}.`,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          // Personal Details
          rollNumber: user.rollNumber,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address,
          phoneNumber: user.phoneNumber,
          // Educational Details
          tenthMarks: user.tenthMarks,
          twelfthMarks: user.twelfthMarks,
          course: user.course,
          university: user.university,
          // Social Media Links
          linkedinProfile: user.linkedinProfile,
          githubProfile: user.githubProfile,
          portfolioWebsite: user.portfolioWebsite,
          // Senior Profile Details
          isSeniorProfileActive: user.isSeniorProfileActive,
          seniorSubjects: user.seniorSubjects,
          seniorDescription: user.seniorDescription,
          profilePictureUrl: user.profilePictureUrl,
          availability: user.availability,
          connectionLink: user.connectionLink,
          averageRating: user.averageRating, // Include averageRating
          sessionsTaken: user.sessionsTaken,
          sessionsAttended: user.sessionsAttended,
        },
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

/**
 * Get current user
 * @route GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviewer',
          select: 'username profilePictureUrl' // Select fields to display about the reviewer
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        // Personal Details
        rollNumber: user.rollNumber,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        phoneNumber: user.phoneNumber,
        // Educational Details
        tenthMarks: user.tenthMarks,
        twelfthMarks: user.twelfthMarks,
        course: user.course,
        university: user.university,
        // Social Media Links
        linkedinProfile: user.linkedinProfile,
        githubProfile: user.githubProfile,
        portfolioWebsite: user.portfolioWebsite,
        // Senior Profile Details
        isSeniorProfileActive: user.isSeniorProfileActive,
        seniorSubjects: user.seniorSubjects,
        seniorDescription: user.seniorDescription,
        profilePictureUrl: user.profilePictureUrl,
        availability: user.availability,
        connectionLink: user.connectionLink,
        averageRating: user.averageRating, // Include averageRating
        sessionsTaken: user.sessionsTaken,
        sessionsAttended: user.sessionsAttended,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

