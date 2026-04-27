const passport =
  require("passport");

const GoogleStrategy =
  require(
    "passport-google-oauth20"
  ).Strategy;

const FacebookStrategy =
  require(
    "passport-facebook"
  ).Strategy;

const User =
  require("../models/User");

/* ===============================
   GOOGLE LOGIN
================================= */

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env
          .GOOGLE_CLIENT_ID,

      clientSecret:
        process.env
          .GOOGLE_CLIENT_SECRET,

      callbackURL:
        "https://shopping-cart-backend-27dv.onrender.com/api/auth/google/callback"
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        const email =
          profile.emails[0]
            .value;

        let user =
          await User.findOne(
            {
              email,
            }
          );

        if (!user) {
          user =
            await User.create(
              {
                name:
                  profile.displayName,

                email:
                  email,

                googleId:
                  profile.id,

                role:
                  "user",
              }
            );
        }

        return done(
          null,
          user
        );
      } catch (error) {
        return done(
          error,
          null
        );
      }
    }
  )
);

/* ===============================
   FACEBOOK LOGIN
================================= */

passport.use(
  new FacebookStrategy(
    {
      clientID:
        process.env
          .FACEBOOK_APP_ID,

      clientSecret:
        process.env
          .FACEBOOK_APP_SECRET,

      callbackURL:
        "http://localhost:5000/api/auth/facebook/callback",

      profileFields: [
        "id",
        "displayName",
      ],
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        const email =
          `${profile.id}@facebook.com`;

        let user =
          await User.findOne(
            {
              $or: [
                {
                  facebookId:
                    profile.id,
                },
                {
                  email:
                    email,
                },
              ],
            }
          );

        if (!user) {
          user =
            await User.create(
              {
                name:
                  profile.displayName,

                email:
                  email,

                facebookId:
                  profile.id,

                role:
                  "user",
              }
            );
        } else {
          if (
            !user.facebookId
          ) {
            user.facebookId =
              profile.id;

            await user.save();
          }
        }

        return done(
          null,
          user
        );
      } catch (error) {
        return done(
          error,
          null
        );
      }
    }
  )
);

/* ===============================
   SESSION SUPPORT
================================= */

passport.serializeUser(
  (
    user,
    done
  ) => {
    done(
      null,
      user.id
    );
  }
);

passport.deserializeUser(
  async (
    id,
    done
  ) => {
    try {
      const user =
        await User.findById(
          id
        );

      done(
        null,
        user
      );
    } catch (error) {
      done(
        error,
        null
      );
    }
  }
);

module.exports =
  passport;