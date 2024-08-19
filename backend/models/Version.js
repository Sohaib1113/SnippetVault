const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Snippet = require('./Snippet');

const Version = sequelize.define('Version', {
  versionId: {
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
Version.belongsTo(Snippet, { foreignKey: 'snippetId', onDelete: 'CASCADE' });
Snippet.hasMany(Version, { foreignKey: 'snippetId', onDelete: 'CASCADE' });

module.exports = Version;
