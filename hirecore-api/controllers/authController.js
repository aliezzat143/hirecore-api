const User = require('../models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');
const generateToken = require('../utils/generateToken');

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password too short' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const allowedRoles = ["client", "freelancer"];
    const userRole = allowedRoles.includes(role) ? role : "client";

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: userRole
    });

    await user.save();

    res.status(201).json({ message: 'User created' });

  } catch (err) {
    console.log("Error in register:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email & password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
