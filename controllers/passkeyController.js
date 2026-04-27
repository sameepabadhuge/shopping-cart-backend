const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require("@simplewebauthn/server");

const User =
  require("../models/User");

const generateToken =
  require(
    "../utils/generateToken"
  );

/* ==================================
   CONFIG
================================== */
const rpName =
  "FreshCart";

/*
For Render + Vercel
Use backend domain only
(no https:// here)
*/
const rpID =
  "shopping-cart-frontend-psi.vercel.app";

/*
Frontend origin
*/
const origin =
  "https://shopping-cart-frontend-psi.vercel.app";

/* ==================================
   TEMP CHALLENGE STORAGE
================================== */
let currentLoginChallenge =
  null;

/* ==================================
   REGISTER OPTIONS
================================== */
const registerOptions =
  async (req, res) => {
    try {
      const { email } =
        req.body;

      const cleanEmail =
        email
          .toLowerCase()
          .trim();

      const user =
        await User.findOne({
          email:
            cleanEmail,
        });

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      const options =
        await generateRegistrationOptions(
          {
            rpName,
            rpID,

            userID:
              Buffer.from(
                user._id.toString(),
                "utf8"
              ),

            userName:
              user.email,

            userDisplayName:
              user.name,

            timeout:
              60000,

            attestationType:
              "none",

            authenticatorSelection:
              {
                residentKey:
                  "preferred",

                userVerification:
                  "preferred",
              },

            excludeCredentials:
              user.passkey
                ?.credentialID
                ? [
                    {
                      id: Buffer.from(
                        user
                          .passkey
                          .credentialID,
                        "base64url"
                      ),
                      type:
                        "public-key",
                    },
                  ]
                : [],
          }
        );

      user.currentChallenge =
        options.challenge;

      await user.save();

      return res.json(
        options
      );
    } catch (error) {
      console.log(
        "REGISTER OPTIONS ERROR:"
      );
      console.log(error);

      return res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };

/* ==================================
   REGISTER VERIFY
================================== */
const registerVerify =
  async (req, res) => {
    try {
      const {
        email,
        credential,
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

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      const verification =
        await verifyRegistrationResponse(
          {
            response:
              credential,

            expectedChallenge:
              user.currentChallenge,

            expectedOrigin:
              origin,

            expectedRPID:
              rpID,
          }
        );

      if (
        !verification?.verified
      ) {
        return res
          .status(400)
          .json({
            message:
              "Passkey registration failed",
          });
      }

      const reg =
        verification.registrationInfo;

      user.passkey = {
        credentialID:
          reg.credential.id,

        publicKey:
          Buffer.from(
            reg
              .credential
              .publicKey
          ).toString(
            "base64url"
          ),

        counter:
          reg
            .credential
            .counter ||
          0,
      };

      user.counter =
        reg
          .credential
          .counter ||
        0;

      user.currentChallenge =
        null;

      await user.save();

      return res.json({
        message:
          "Passkey registered successfully",
      });
    } catch (error) {
      console.log(
        "REGISTER VERIFY ERROR:"
      );
      console.log(error);

      return res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };

/* ==================================
   LOGIN OPTIONS
================================== */
const loginOptions =
  async (req, res) => {
    try {
      const options =
        await generateAuthenticationOptions(
          {
            rpID,
            timeout:
              60000,
            userVerification:
              "preferred",
          }
        );

      currentLoginChallenge =
        options.challenge;

      return res.json(
        options
      );
    } catch (error) {
      console.log(
        "LOGIN OPTIONS ERROR:"
      );
      console.log(error);

      return res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };

/* ==================================
   LOGIN VERIFY
================================== */
const loginVerify =
  async (req, res) => {
    try {
      const {
        credential,
      } = req.body;

      const user =
        await User.findOne({
          "passkey.credentialID":
            credential.id,
        });

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      if (
        !user.passkey ||
        !user.passkey
          .credentialID ||
        !user.passkey
          .publicKey
      ) {
        return res
          .status(400)
          .json({
            message:
              "No valid passkey found. Please register again.",
          });
      }

      const storedCredential =
        {
          id: Buffer.from(
            user.passkey
              .credentialID,
            "base64url"
          ),

          publicKey:
            Buffer.from(
              user.passkey
                .publicKey,
              "base64url"
            ),

          counter:
            Number(
              user
                .passkey
                ?.counter ??
                0
            ),

          transports:
            [
              "internal",
            ],
        };

      const verification =
        await verifyAuthenticationResponse(
          {
            response:
              credential,

            expectedChallenge:
              currentLoginChallenge,

            expectedOrigin:
              origin,

            expectedRPID:
              rpID,

            credential:
              storedCredential,
          }
        );

      if (
        !verification?.verified
      ) {
        return res
          .status(401)
          .json({
            message:
              "Passkey login failed",
          });
      }

      const newCounter =
        verification
          ?.authenticationInfo
          ?.newCounter ??
        0;

      user.passkey.counter =
        newCounter;

      await user.save();

      currentLoginChallenge =
        null;

      return res.json({
        _id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role,

        token:
          generateToken(
            user._id
          ),
      });
    } catch (error) {
      console.log(
        "LOGIN VERIFY ERROR:"
      );
      console.log(error);

      return res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };

/* ==================================
   REMOVE PASSKEY
================================== */
const removePasskey =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      user.passkey = {
        credentialID:
          null,

        publicKey:
          null,

        counter: 0,
      };

      user.counter = 0;

      await user.save();

      return res.json({
        message:
          "Passkey removed successfully",
      });
    } catch (error) {
      console.log(
        "REMOVE PASSKEY ERROR:"
      );
      console.log(error);

      return res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };

module.exports = {
  registerOptions,
  registerVerify,
  loginOptions,
  loginVerify,
  removePasskey,
};