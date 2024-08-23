const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const auth = require('./middleware/auth');
const Version = require('./models/Version');  // New model
const Comment = require('./models/Comment');  // New model
const collectionRoutes = require('./routes/collection');
const app = express();

// Import routes
const profileRoutes = require('./routes/profile');
const authRoutes = require('./routes/auth');
const snippetRoutes = require('./routes/snippet');

// Enable CORS for all routes
app.use(cors());

// For parsing application/json
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/snippets', auth, snippetRoutes);
app.use('/api/profile', auth, profileRoutes);
app.use('/api/settings', require('./routes/settings'));

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to SnippetVault API');
});

// Sync models with the database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error synchronizing the database:', err);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Add the collection routes
app.use('/api/collections', auth, collectionRoutes);