const User =
  require("../models/User");

const bcrypt =
  require("bcryptjs");

const generateToken =
  require("../utils/generateToken");

/* ==================================
   REGISTER USER
================================== */
const registerUser =
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      const cleanEmail =
        email
          .toLowerCase()
          .trim();

      const exists =
        await User.findOne({
          email:
            cleanEmail,
        });

      if (exists) {
        return res
          .status(400)
          .json({
            message:
              "User already exists",
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          name:
            name.trim(),
          email:
            cleanEmail,
          password:
            hashedPassword,
          role:
            "user",
        });

      res.status(201).json({
        message:
          "Registered successfully",
        token:
          generateToken(
            user._id
          ),
        user: {
          _id:
            user._id,
          name:
            user.name,
          email:
            user.email,
          role:
            user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* ==================================
   USER LOGIN
================================== */
const loginUser =
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      const cleanEmail =
        email
          .toLowerCase()
          .trim();

      const user =
        await User.findOne({
          email:
            cleanEmail,
        });

      if (
        user &&
        user.role ===
          "user" &&
        (await bcrypt.compare(
          password,
          user.password
        ))
      ) {
        return res.json({
          message:
            "Login success",
          token:
            generateToken(
              user._id
            ),
          user: {
            _id:
              user._id,
            name:
              user.name,
            email:
              user.email,
            role:
              user.role,
          },
        });
      }

      res.status(401).json({
        message:
          "Invalid credentials",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* ==================================
   PASSCODE LOGIN
================================== */
const loginWithPasscode =
  async (req, res) => {
    try {
      const {
        email,
        passcode,
      } = req.body;

      const cleanEmail =
        email
          .toLowerCase()
          .trim();

      const user =
        await User.findOne({
          email:
            cleanEmail,
        });

      if (
        !user ||
        user.role !==
          "user"
      ) {
        return res
          .status(401)
          .json({
            message:
              "User not found",
          });
      }

      if (
        !user.passcodeHash
      ) {
        return res
          .status(400)
          .json({
            message:
              "No passcode added",
          });
      }

      const match =
        await bcrypt.compare(
          passcode,
          user.passcodeHash
        );

      if (!match) {
        return res
          .status(401)
          .json({
            message:
              "Invalid passcode",
          });
      }

      return res.json({
        message:
          "Login success",
        token:
          generateToken(
            user._id
          ),
        user: {
          _id:
            user._id,
          name:
            user.name,
          email:
            user.email,
          role:
            user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* ==================================
   ADMIN LOGIN
================================== */
const loginAdmin =
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      const cleanEmail =
        email
          .toLowerCase()
          .trim();

      const admin =
        await User.findOne({
          email:
            cleanEmail,
        });

      if (
        admin &&
        admin.role ===
          "admin" &&
        (await bcrypt.compare(
          password,
          admin.password
        ))
      ) {
        return res.json({
          message:
            "Admin login success",
          token:
            generateToken(
              admin._id
            ),
          user: {
            _id:
              admin._id,
            name:
              admin.name,
            email:
              admin.email,
            role:
              admin.role,
          },
        });
      }

      res.status(401).json({
        message:
          "Invalid admin credentials",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* ==================================
   PROFILE
================================== */
const getProfile =
  async (req, res) => {
    res.json(
      req.user
    );
  };

/* ==================================
   EXPORTS
================================== */
module.exports = {
  registerUser,
  loginUser,
  loginWithPasscode,
  loginAdmin,
  getProfile,
};