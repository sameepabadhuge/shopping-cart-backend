const express = require("express");
const router = express.Router();

const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require("@simplewebauthn/server");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const rpName = "FreshCart";
const rpID = "localhost";
const origin = "http://localhost:5173";

// =======================
// Register Passkey Start
// =======================
router.post("/register/options", async (req, res) => {
  const { email } = req.body;

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: email,
    userName: email,
  });

  res.json(options);
});

// =======================
// Register Verify
// =======================
router.post("/register/verify", async (req, res) => {
  const { email, credential } = req.body;

  const verification =
    await verifyRegistrationResponse({
      response: credential,
      expectedChallenge:
        credential.response.clientDataJSON,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

  if (verification.verified) {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: email,
        email,
        role: "user",
      });
    }

    user.passkeyId =
      verification.registrationInfo
        .credentialID.toString("base64");

    user.publicKey =
      verification.registrationInfo
        .credentialPublicKey.toString("base64");

    await user.save();

    res.json({
      message: "Passkey registered",
    });
  } else {
    res.status(400).json({
      message: "Failed",
    });
  }
});

// =======================
// Login Options
// =======================
router.post("/login/options", async (req, res) => {
  const options =
    await generateAuthenticationOptions({
      rpID,
    });

  res.json(options);
});

// =======================
// Login Verify
// =======================
router.post("/login/verify", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ message: "User not found" });
  }

  const token = generateToken(user._id);

  res.json({
    token,
    user,
  });
});

module.exports = router;