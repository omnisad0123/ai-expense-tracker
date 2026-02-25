const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Sign the token with the ID
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send back the token AND user info for the UI
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};


exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // From your authMiddleware

    // 1. Delete all associated data first
    await Expense.deleteMany({ user: userId });
    await Budget.deleteMany({ user: userId });

    // 2. Delete the user profile
    await User.findByIdAndDelete(userId);

    res.json({ message: "Account and all associated data deleted successfully." });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ message: "Server error during account deletion." });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { name }, 
      { new: true } 
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};