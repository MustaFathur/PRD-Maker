const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

const callbackURL = `${process.env.BASE_URL}/api/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { google_id: profile.id } });

        if (!user) {
          const userData = {
            email: profile.emails[0].value,
            name: profile.displayName,
            google_id: profile.id,
            google_access_token: accessToken,
            auth_type: 'oauth',
            password: null, // No password for OAuth
          };

          user = await User.create(userData);
        }

        done(null, user);
      } catch (err) {
        console.error('Error during OAuth registration', err);
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;