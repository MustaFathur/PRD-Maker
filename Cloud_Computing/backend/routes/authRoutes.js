const express = require('express');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, isNotAuthenticated } = require('../middleware/authMiddleware');

// Conventional Auth Routes
router.post('/register', isNotAuthenticated, authController.registerUser);
router.post('/login', isNotAuthenticated, authController.loginUser);
router.post('/refresh-token', authController.refreshAccessToken);
router.post('/logout', authMiddleware, authController.logoutUser);
router.get('/check-auth', authController.checkAuth);
router.get('/verify-token', authController.verifyToken);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/register' }), authController.googleOAuthCallback);

module.exports = router;