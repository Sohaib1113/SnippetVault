const express = require('express');
const cors = require('cors'); // Import CORS
const sequelize = require('./db');
const auth = require('./middleware/auth');
const app = express();

// Import routes
const profileRoutes = require('./routes/profile');
const authRoutes = require('./routes/auth');
const snippetRoutes = require('./routes/snippet');  // We will create this route later

// Enable CORS for all routes
app.use(cors());

// For parsing application/json
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);              // For authentication (register, login)
app.use('/api/snippets', auth, snippetRoutes); // Protect snippet routes with auth middleware
app.use('/api/profile', auth, profileRoutes);  // Protect profile routes with auth middleware

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to SnippetVault API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
