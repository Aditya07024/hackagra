const { User, File } = require("../models/index");
const bcryptjs = require("bcryptjs");

/**
 * Create a new user
 * @route POST /api/users/create
 */
exports.createUser = async (req, res) => {
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

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

/**
 * Get user by ID
 * @route GET /api/users/:userId
 */
exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId).populate({ path: 'files', options: { sort: { uploadedAt: -1 } } });

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
        filesCount: user.files?.length || 0,
        files: user.files || [],
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

/**
 * Get leaderboard data
 * @route GET /api/users/leaderboard
 */
exports.getLeaderboard = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Leaderboard data fetched successfully",
      data: [
        { id: "1", username: "UserA", score: 100 },
        { id: "2", username: "UserB", score: 90 },
        { id: "3", username: "UserC", score: 80 },
      ],
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
      error: error.message,
    });
  }
};

/**
 * Get dashboard statistics
 * @route GET /api/users/dashboard/stats
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        filesUploaded: user.files?.length || 0,
        sessionsTaken: user.sessionsTaken || 0,
        sessionsAttended: user.sessionsAttended || 0,
        quizzesTaken: user.quizzesTaken || 0, // Assuming quizzesTaken is also a field in User model
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

/**
 * Get planner data
 * @route GET /api/users/planner
 */
exports.getPlannerData = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Planner data fetched successfully",
      data: [
        { id: "1", title: "Study MERN Stack", date: "2023-12-01" },
        { id: "2", title: "Build a new feature", date: "2023-12-05" },
      ],
    });
  } catch (error) {
    console.error("Error fetching planner data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching planner data",
      error: error.message,
    });
  }
};

/**
 * Update user's senior profile
 * @route PUT /api/users/:userId/senior-profile
 */
exports.updateSeniorProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from authenticated user
    const { seniorSubjects, seniorDescription, profilePictureUrl, availability, connectionLink } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.seniorSubjects = seniorSubjects || user.seniorSubjects; // Update to seniorSubjects array
    user.seniorDescription = seniorDescription || user.seniorDescription;
    user.profilePictureUrl = profilePictureUrl || user.profilePictureUrl;
    user.availability = availability || user.availability;
    user.connectionLink = connectionLink || user.connectionLink;
    user.isSeniorProfileActive = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Senior profile updated successfully",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isSeniorProfileActive: user.isSeniorProfileActive,
        seniorSubjects: user.seniorSubjects, // Return the updated seniorSubjects
        seniorDescription: user.seniorDescription,
        profilePictureUrl: user.profilePictureUrl,
        availability: user.availability,
        connectionLink: user.connectionLink,
      },
    });
  } catch (error) {
    console.error("Error updating senior profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating senior profile",
      error: error.message,
    });
  }
};

/**
 * Get all active senior profiles
 * @route GET /api/users/seniors
 */
exports.getSeniors = async (req, res) => {
  try {
    const seniors = await User.find({ isSeniorProfileActive: true })
      .select('-password') // Exclude password from the results
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviewer',
          select: 'username profilePictureUrl'
        }
      });

    res.status(200).json({
      success: true,
      message: 'Active senior profiles fetched successfully',
      data: seniors,
    });
  } catch (error) {
    console.error('Error fetching senior profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching senior profiles',
      error: error.message,
    });
  }
};

/**
 * Update user's general details
 * @route PUT /api/users/:userId/details
 */
exports.updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      username,
      rollNumber,
      dateOfBirth,
      gender,
      address,
      phoneNumber,
      tenthMarks,
      twelfthMarks,
      course,
      university,
      linkedinProfile,
      githubProfile,
      portfolioWebsite,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update fields if provided
    if (username) user.username = username;
    if (rollNumber) user.rollNumber = rollNumber;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (address) user.address = address;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (tenthMarks) user.tenthMarks = tenthMarks;
    if (twelfthMarks) user.twelfthMarks = twelfthMarks;
    if (course) user.course = course;
    if (university) user.university = university;
    if (linkedinProfile) user.linkedinProfile = linkedinProfile;
    if (githubProfile) user.githubProfile = githubProfile;
    if (portfolioWebsite) user.portfolioWebsite = portfolioWebsite;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        phoneNumber: user.phoneNumber,
        tenthMarks: user.tenthMarks,
        twelfthMarks: user.twelfthMarks,
        course: user.course,
        university: user.university,
        linkedinProfile: user.linkedinProfile,
        githubProfile: user.githubProfile,
        portfolioWebsite: user.portfolioWebsite,
      },
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user details",
      error: error.message,
    });
  }
};
