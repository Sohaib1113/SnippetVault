const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Snippet = require('../models/Snippet');

// @route   POST /api/snippets
// @desc    Create a new snippet
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, code, tags } = req.body;

  try {
    const newSnippet = new Snippet({
      title,
      description,
      code,
      tags,
      userId: req.user.id  // Associate snippet with the logged-in user
    });

    const snippet = await newSnippet.save();
    res.json(snippet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/snippets
// @desc    Get all snippets for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const snippets = await Snippet.findAll({ where: { userId: req.user.id } });
    res.json(snippets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/snippets/:id
// @desc    Get a single snippet by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const snippet = await Snippet.findByPk(req.params.id);

    if (!snippet || snippet.userId !== req.user.id) {
      return res.status(404).json({ msg: 'Snippet not found' });
    }

    res.json(snippet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/snippets/:id
// @desc    Update a snippet by ID
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, code, tags } = req.body;

  try {
    let snippet = await Snippet.findByPk(req.params.id);

    if (!snippet || snippet.userId !== req.user.id) {
      return res.status(404).json({ msg: 'Snippet not found' });
    }

    snippet.title = title || snippet.title;
    snippet.description = description || snippet.description;
    snippet.code = code || snippet.code;
    snippet.tags = tags || snippet.tags;

    await snippet.save();

    res.json(snippet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/snippets/:id
// @desc    Delete a snippet by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const snippet = await Snippet.findByPk(req.params.id);

    if (!snippet || snippet.userId !== req.user.id) {
      return res.status(404).json({ msg: 'Snippet not found' });
    }

    await snippet.destroy();
    res.json({ msg: 'Snippet removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// Get all snippets for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
      const snippets = await Snippet.findAll({
        where: {
          userId: req.user.id, // Filter snippets by the authenticated user's ID
        },
        order: [['createdAt', 'DESC']], // Optional: Order snippets by creation date
      });
  
      res.json(snippets);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
// @route   POST /api/snippets
// @desc    Create a new snippet
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, description, code, tags } = req.body;
  
    try {
      const newSnippet = new Snippet({
        title,
        description,
        code,
        tags,
        userId: req.user.id,  // Associate snippet with the logged-in user
      });
  
      const snippet = await newSnippet.save();
      res.json(snippet);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
module.exports = router;
