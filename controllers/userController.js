const User =
  require("../models/User");

const bcrypt =
  require("bcryptjs");

/* =========================
   UPDATE PROFILE
========================= */
const updateProfile =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        );

      if (!user)
        return res.status(404).json({
          message:
            "User not found",
        });

      user.name =
        req.body.name ||
        user.name;

      user.email =
        req.body.email ||
        user.email;

      user.phone =
        req.body.phone ||
        user.phone;

      await user.save();

      res.json({
        message:
          "Profile updated",
        user: {
          _id:
            user._id,
          name:
            user.name,
          email:
            user.email,
          phone:
            user.phone,
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

/* =========================
   SECURITY STATUS
========================= */
const getSecurityStatus =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        );

      res.json({
        hasPasscode:
          !!user.passcodeHash,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* =========================
   ADD PASSCODE
========================= */
const addPasscode =
  async (req, res) => {
    try {
      const { passcode } =
        req.body;

      if (
        !passcode ||
        passcode.trim() === ""
      ) {
        return res.status(400).json({
          message:
            "Passcode required",
        });
      }

      const user =
        await User.findById(
          req.user._id
        );

      if (
        user.passcodeHash
      ) {
        return res.status(400).json({
          message:
            "Passcode already exists",
        });
      }

      user.passcodeHash =
        await bcrypt.hash(
          passcode,
          10
        );

      await user.save();

      res.json({
        message:
          "Passcode added successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* =========================
   CHANGE PASSCODE
========================= */
const changePasscode =
  async (req, res) => {
    try {
      const {
        oldPasscode,
        newPasscode,
      } = req.body;

      const user =
        await User.findById(
          req.user._id
        );

      if (
        !user.passcodeHash
      ) {
        return res.status(400).json({
          message:
            "No passcode found",
        });
      }

      const match =
        await bcrypt.compare(
          oldPasscode,
          user.passcodeHash
        );

      if (!match) {
        return res.status(400).json({
          message:
            "Old passcode incorrect",
        });
      }

      user.passcodeHash =
        await bcrypt.hash(
          newPasscode,
          10
        );

      await user.save();

      res.json({
        message:
          "Passcode changed successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* =========================
   REMOVE PASSCODE
========================= */
const removePasscode =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        );

      if (
        !user.passcodeHash
      ) {
        return res.status(400).json({
          message:
            "No passcode found",
        });
      }

      user.passcodeHash =
        null;

      await user.save();

      res.json({
        message:
          "Passcode removed successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  updateProfile,
  getSecurityStatus,
  addPasscode,
  changePasscode,
  removePasscode,
};