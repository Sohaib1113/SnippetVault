const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('snippetvault_db', 'root', 'tiger', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  });

module.exports = sequelize;
