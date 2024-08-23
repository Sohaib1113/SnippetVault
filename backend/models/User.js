const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apiKey: {
    type: DataTypes.STRING,
    allowNull: true, // Initially null, can be generated later
  },
  settings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      twoFactorAuth: false,
      emailNotifications: true,
      pushNotifications: true,
      defaultSnippetLanguage: 'JavaScript',
      snippetSharingPreference: 'private',
      profileVisibility: 'public',
      language: 'en',
      timeZone: 'UTC',
    },
  },
}, {
  // Additional Model Options
  timestamps: true, // Adds createdAt and updatedAt fields
  tableName: 'users', // Custom table name if different from model name
});

// You can also add associations here if needed
// e.g., User.hasMany(Snippet, { foreignKey: 'userId' });

module.exports = User;
