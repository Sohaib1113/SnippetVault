const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Snippet = require('./Snippet');
const User = require('./User');

const Collection = sequelize.define('Collection', {
  collectionId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true,
});

// Define the many-to-many association between Collections and Snippets
Collection.belongsToMany(Snippet, { through: 'CollectionSnippets' });
Snippet.belongsToMany(Collection, { through: 'CollectionSnippets' });

module.exports = Collection;
