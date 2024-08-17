const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/profile - Get user profile
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id); // Use findByPk for primary key
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PUT /api/profile - Update user profile
router.put('/', auth, async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findByPk(req.user.id); // Use findByPk for primary key
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
