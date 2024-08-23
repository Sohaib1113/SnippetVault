const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware for authentication
const User = require('../models/User'); // User model
const bcrypt = require('bcryptjs'); // For hashing passwords

// GET /api/settings - Fetch current user settings, including username and email
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // Exclude password field
    });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Return the user username and email along with other settings
    res.json({
      username: user.username,
      email: user.email,
      twoFactorAuth: user.twoFactorAuth,
      emailNotifications: user.emailNotifications,
      pushNotifications: user.pushNotifications,
      defaultSnippetLanguage: user.defaultSnippetLanguage,
      snippetSharingPreference: user.snippetSharingPreference,
      profileVisibility: user.profileVisibility,
      language: user.language,
      timeZone: user.timeZone,
    });
  } catch (err) {
    console.error('Error fetching user settings:', err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/settings - Update user settings including username, email, and password
router.put('/', auth, async (req, res) => {
  const { username, email, password, ...updates } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update username if provided
    if (username) {
      user.username = username;
    }

    // Update email if provided
    if (email) {
      user.email = email;
    }

    // Hash and update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Update other user settings
    user.settings = { ...user.settings, ...updates };
    await user.save();

    res.json({
      username: user.username,
      email: user.email,
      twoFactorAuth: user.twoFactorAuth,
      emailNotifications: user.emailNotifications,
      pushNotifications: user.pushNotifications,
      defaultSnippetLanguage: user.defaultSnippetLanguage,
      snippetSharingPreference: user.snippetSharingPreference,
      profileVisibility: user.profileVisibility,
      language: user.language,
      timeZone: user.timeZone,
    });
  } catch (err) {
    console.error('Error updating user settings:', err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/settings/regenerate-api-key - Regenerate the user's API key
router.post('/regenerate-api-key', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Generate a new API key (ensure this method is secure)
    user.apiKey = generateApiKey();
    await user.save();

    res.json({ apiKey: user.apiKey });
  } catch (err) {
    console.error('Error regenerating API key:', err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/settings/delete-account - Delete the user's account
router.post('/delete-account', auth, async (req, res) => {
  try {
    await User.destroy({ where: { id: req.user.id } });
    res.json({ msg: 'Account deleted successfully' });
  } catch (err) {
    console.error('Error deleting account:', err.message);
    res.status(500).send('Server Error');
  }
});

function generateApiKey() {
  return require('crypto').randomBytes(20).toString('hex');
}

module.exports = router;
