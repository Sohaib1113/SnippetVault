const { Sequelize } = require('sequelize');

// Initialize Sequelize with database connection details
const sequelize = new Sequelize('snippetvault_db', 'root', 'tiger', {
  host: 'localhost',
  dialect: 'mysql',
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Synchronize all models with the database
sequelize.sync({ force: true }) // Set to 'true' to force re-creation of tables
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

module.exports = sequelize;
