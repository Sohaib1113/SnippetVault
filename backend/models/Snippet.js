const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Snippet = sequelize.define('Snippet', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shareableLink: {
    type: DataTypes.STRING,
    unique: true,
  },
  sharedWithEmail: {
    type: DataTypes.STRING,
    allowNull: true, // This is optional
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  forkedFromSnippetId: {
    type: DataTypes.INTEGER,
    allowNull: true, // This will track the original snippet if it's a fork
  },
}, {
  timestamps: true, // Automatically includes createdAt and updatedAt fields
});

// Define the association with the User model
Snippet.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = Snippet;
