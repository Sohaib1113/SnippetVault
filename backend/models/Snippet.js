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
  }
});

// Define the association with the User model
Snippet.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = Snippet;
