const User = require('../models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');
const validateObjectId = require('../utils/validateObjectId');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        if (req.user.userId !== id) {
            return res.status(403).json({ message: "You can only update your own profile picture" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file provided" });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'freelance/profile-pictures');

        const user = await User.findByIdAndUpdate(
            id,
            { profilePic: result.secure_url },
            { new: true }
        );

        res.json(user);
    } catch (err) {
        console.error("Error uploading profile picture:", err);
        res.status(500).json({ message: "Error uploading profile picture" });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        if (req.user.userId !== id) {
            return res.status(403).json({ message: "You can only update your own account" });
        }
        const { username, email, password, profilePic, bio, skills, hourlyRate } = req.body;

        if (email && !validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }
        if (password && password.length < 8) {
            return res.status(400).json({ message: "Password too short" });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (profilePic) user.profilePic = profilePic;
        if (bio) user.bio = bio;
        if (skills) user.skills = skills;
        if (hourlyRate) user.hourlyRate = hourlyRate;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        if (req.user.role !== "admin" && req.user.userId !== id) {
            return res.status(403).json({ message: "You can only delete your own account" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error in delete user:", err);
        res.status(500).json({ message: "Server error" });
    }
};
