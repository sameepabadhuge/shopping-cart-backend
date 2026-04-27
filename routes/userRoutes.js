const express =
  require("express");

const router =
  express.Router();

const {
  updateProfile,
  getSecurityStatus,
  addPasscode,
  changePasscode,
  removePasscode,
} = require(
  "../controllers/userController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

/* =========================
   PROFILE
========================= */

router.put(
  "/update-profile",
  protect,
  updateProfile
);

/* =========================
   SECURITY
========================= */

// NEW: Get status
router.get(
  "/security-status",
  protect,
  getSecurityStatus
);

// Add passcode
router.post(
  "/add-passcode",
  protect,
  addPasscode
);

// Change passcode
router.put(
  "/change-passcode",
  protect,
  changePasscode
);

// Remove passcode
router.delete(
  "/remove-passcode",
  protect,
  removePasscode
);

module.exports =
  router;