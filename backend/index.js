require('dotenv').config();

const express = require('express');
const sequelize = require('./db');

const app = express();

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to SnippetVault API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const Snippet = require('./Snippet');

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  });
