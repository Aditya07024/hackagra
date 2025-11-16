const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, "Filename is required"],
    trim: true,
  },
  firebaseUrl: {
    type: String,
    required: [true, "Firebase URL is required"],
  },
  fileType: {
    type: String,
    default: "unknown",
  },
  fileSize: {
    type: Number,
    default: 0,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
  },
  email: {
  type: String,
  required: true,
  unique: true,   // <-- THIS creates a unique index in MongoDB
},
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isSeniorProfileActive: {
    type: Boolean,
    default: false,
  },
  seniorSubjects: [
    {
      subject: { type: String, trim: true },
      marks: { type: String, trim: true },
    },
  ],
  seniorDescription: {
    type: String,
    trim: true,
  },
  profilePictureUrl: {
    type: String,
  },
  connectionLink: {
    type: String,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  rollNumber: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  address: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  tenthMarks: {
    type: String,
    trim: true,
  },
  twelfthMarks: {
    type: String,
    trim: true,
  },
  course: {
    type: String,
    trim: true,
  },
  university: {
    type: String,
    trim: true,
  },
  linkedinProfile: {
    type: String,
    trim: true,
  },
  githubProfile: {
    type: String,
    trim: true,
  },
  portfolioWebsite: {
    type: String,
    trim: true,
  },
  sessionsTaken: {
    type: Number,
    default: 0,
  },
  sessionsAttended: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  files: [fileSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Remove manual indexes — these caused duplicates
// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });
userSchema.index({ "files.uploadedAt": -1 }); // keep this one

module.exports = mongoose.model("User", userSchema);