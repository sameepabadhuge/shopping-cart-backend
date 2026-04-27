const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

/* =================================
   REGISTER USER
================================= */
const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    email = email.toLowerCase().trim();

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      message: "Registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =================================
   USER LOGIN
================================= */
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.role !== "user") {
      return res.status(401).json({
        message: "Use admin login",
      });
    }

    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }

    res.json({
      message: "Login success",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =================================
   ADMIN LOGIN
================================= */
const loginAdmin = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    const admin =
      await User.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found",
      });
    }

    if (admin.role !== "admin") {
      return res.status(401).json({
        message:
          "This account is not admin",
      });
    }

    const match =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!match) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }

    res.json({
      message:
        "Admin login success",
      token: generateToken(
        admin._id
      ),
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =================================
   GET PROFILE
================================= */
const getProfile = async (
  req,
  res
) => {
  res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  getProfile,
};