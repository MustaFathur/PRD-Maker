const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signToken = (id, secret, expiresIn) => {
  if (!secret) {
    throw new Error('JWT secret is not defined');
  }
  return jwt.sign({ id }, secret, { expiresIn });
};

const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email,
      name,
      password: hashedPassword
    });

    const accessToken = signToken(newUser.user_id, process.env.JWT_SECRET, '15m');
    const refreshToken = signToken(newUser.user_id, process.env.JWT_REFRESH_SECRET, '7d');

    await newUser.update({ refresh_token: refreshToken });

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = signToken(user.user_id, process.env.JWT_SECRET, '15m');
    const refreshToken = signToken(user.user_id, process.env.JWT_REFRESH_SECRET, '7d');

    await user.update({ refresh_token: refreshToken });

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh token is required' });
    }

    const user = await User.findOne({ where: { refresh_token: refreshToken } });

    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid refresh token' });

      const newAccessToken = signToken(decoded.id, process.env.JWT_SECRET, '15m');

      res.cookie('jwt', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const logoutUser = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({ message: 'User logged out successfully' });
};

const checkAuth = (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ authenticated: true });
  } catch (error) {
    return res.json({ authenticated: false });
  }
};

const verifyToken = (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ message: 'Authenticated' });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const googleOAuthCallback = async (req, res) => {
  try {
    // Generate JWT token
    const token = jwt.sign({ id: req.user.user_id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: req.user.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Update user with refresh token
    await req.user.update({ refresh_token: refreshToken });

    // Set JWT token in cookies
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect the user to the dashboard after successful login
    res.redirect('http://localhost:5173/dashboard');
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    res.redirect('/register');
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  checkAuth,
  verifyToken,
  googleOAuthCallback,
};