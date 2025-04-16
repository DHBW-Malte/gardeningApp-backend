const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { findUserByEmail, createUser } = require("../models/auth");


// Helper functions to generate tokens
const generateAccessToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "1d" });

// LOGIN
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await findUserByEmail(email);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password+ process.env.PEPPER, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.status(200).json({
    accessToken,
    refreshToken,
    user,
  });
});

// SIGNUP
const signup = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser.rows.length > 0) {
    return res.status(400).json({ error: "Email already registered" });
  }
  
  const pepper = process.env.PEPPER;
  const hashedPassword = await bcrypt.hash(password + pepper, 10);
  const result = await createUser(email, hashedPassword, username);

  const user = result.rows[0];

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.status(200).json({
    accessToken,
    refreshToken,
    user,
  });
});

// REFRESH TOKEN
const jsonrefresh = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken({ id: payload.id });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
});

module.exports = { login, signup, jsonrefresh };
