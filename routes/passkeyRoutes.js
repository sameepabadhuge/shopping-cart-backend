const express =
  require("express");

const router =
  express.Router();

const {
  registerOptions,
  registerVerify,
  loginOptions,
  loginVerify,
  removePasskey,
} = require(
  "../controllers/passkeyController"
);

/* FIXED IMPORT */
const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

/* PASSKEY REGISTER */
router.post(
  "/register/options",
  registerOptions
);

router.post(
  "/register/verify",
  registerVerify
);

/* PASSKEY LOGIN */
router.post(
  "/login/options",
  loginOptions
);

router.post(
  "/login/verify",
  loginVerify
);

/* REMOVE PASSKEY */
router.delete(
  "/remove",
  protect,
  removePasskey
);

module.exports =
  router;