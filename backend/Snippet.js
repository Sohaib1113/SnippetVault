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
    references: {
      model: User, // Reference to the 'Users' table
      key: 'id',
    },
  },
});

// Ensure the foreign key relationship is established
Snippet.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = Snippet;
