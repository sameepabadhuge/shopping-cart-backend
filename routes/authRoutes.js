const express =
  require("express");

const router =
  express.Router();

const passport =
  require("passport");

const jwt =
  require("jsonwebtoken");

const {
  registerUser,
  loginUser,
  loginWithPasscode,
  loginAdmin,
  getProfile,
} = require(
  "../controllers/authController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

/* ==================================
   FRONTEND URL
================================== */
const CLIENT_URL =
  "https://shopping-cart-frontend-psi.vercel.app";

/* ==================================
   NORMAL AUTH ROUTES
================================== */

/* Register */
router.post(
  "/register",
  registerUser
);

/* User Login */
router.post(
  "/login",
  loginUser
);

/* Passcode Login */
router.post(
  "/passcode-login",
  loginWithPasscode
);

/* Admin Login */
router.post(
  "/admin-login",
  loginAdmin
);

/* User Profile */
router.get(
  "/profile",
  protect,
  getProfile
);

/* ==================================
   GOOGLE LOGIN ROUTES
================================== */

/* Start Google Login */
router.get(
  "/google",
  passport.authenticate(
    "google",
    {
      scope: [
        "profile",
        "email",
      ],
    }
  )
);

/* Google Callback */
router.get(
  "/google/callback",

  passport.authenticate(
    "google",
    {
      session: false,

      failureRedirect:
        `${CLIENT_URL}/login`,
    }
  ),

  (req, res) => {
    const token =
      jwt.sign(
        {
          id:
            req.user._id,

          email:
            req.user.email,

          role:
            req.user.role,
        },

        process.env.JWT_SECRET,

        {
          expiresIn:
            "7d",
        }
      );

    res.redirect(
      `${CLIENT_URL}/login?token=${token}`
    );
  }
);

/* ==================================
   FACEBOOK LOGIN ROUTES
================================== */

/* Start Facebook Login */
router.get(
  "/facebook",

  passport.authenticate(
    "facebook",
    {
      scope: [
        "email",
      ],
    }
  )
);

/* Facebook Callback */
router.get(
  "/facebook/callback",

  passport.authenticate(
    "facebook",
    {
      session: false,

      failureRedirect:
        `${CLIENT_URL}/login`,
    }
  ),

  (req, res) => {
    const token =
      jwt.sign(
        {
          id:
            req.user._id,

          email:
            req.user.email,

          role:
            req.user.role,
        },

        process.env.JWT_SECRET,

        {
          expiresIn:
            "7d",
        }
      );

    res.redirect(
      `${CLIENT_URL}/login?token=${token}`
    );
  }
);

module.exports =
  router;