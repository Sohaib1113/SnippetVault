const express = require('express');
const sequelize = require('./db');
const auth = require('./middleware/auth');
const app = express();

app.use(express.json());

// Route imports
const authRoutes = require('./routes/auth');
const snippetRoutes = require('./routes/snippet');  // We will create this route later

// Use routes
app.use('/api/auth', authRoutes);              // For authentication (register, login)
app.use('/api/snippets', auth, snippetRoutes); // Protect snippet routes with auth middleware

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to SnippetVault API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
