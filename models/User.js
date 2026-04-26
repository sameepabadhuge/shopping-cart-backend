const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /* =====================================
       BASIC INFO
    ===================================== */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    /* =====================================
       AUTH METHODS
    ===================================== */

    // Normal login
    password: {
      type: String,
      default: null,
    },

    // Google login
    googleId: {
      type: String,
      default: null,
    },

    // Facebook login
    facebookId: {
      type: String,
      default: null,
    },

    /* =====================================
       REAL PASSKEY (WebAuthn)
    ===================================== */
    passkey: {
      credentialID: {
        type: String,
        default: null,
      },

      publicKey: {
        type: String,
        default: null,
      },

      counter: {
        type: Number,
        default: 0,
      },
    },

    // Temporary challenge during register/login
    currentChallenge: {
      type: String,
      default: null,
    },

    /* =====================================
       ROLE
    ===================================== */
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);