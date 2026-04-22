

const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  registerUser,
  loginUser,
  loginAdmin,
  getProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");


// Normal Auth Routes


// Register
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// Admin Login
router.post("/admin-login", loginAdmin);

// User Profile
router.get("/profile", protect, getProfile);


// Google Login Routes


// Start Google Login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect back to Login page with token
    res.redirect(
      `http://localhost:5173/login?token=${token}`
    );
  }
);

module.exports = router;