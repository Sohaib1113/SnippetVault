const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Snippet = require('./Snippet');

const Comment = sequelize.define('Comment', {
  commentId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  snippetId: {
    type: DataTypes.INTEGER,
    references: {
      model: Snippet,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true, // Automatically includes createdAt and updatedAt fields
});

// Define the association with the Snippet model
Comment.belongsTo(Snippet, { foreignKey: 'snippetId', onDelete: 'CASCADE' });
Snippet.hasMany(Comment, { foreignKey: 'snippetId', onDelete: 'CASCADE' });

module.exports = Comment;
