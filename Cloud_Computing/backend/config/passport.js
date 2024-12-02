const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models'); // Adjust path to your User model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in your database
        let user = await User.findOne({ where: { google_id: profile.id } });

        // If user doesn't exist, create a new one
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

        // Pass user data into the `done` callback
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