const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Collection = require('../models/Collection');
const Snippet = require('../models/Snippet');

// @route   POST /api/collections
// @desc    Create a new collection
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, description } = req.body;

  try {
    const newCollection = new Collection({
      name,
      description,
      userId: req.user.id,
    });

    const collection = await newCollection.save();
    res.json(collection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/collections
// @desc    Get all collections for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const collections = await Collection.findAll({
      where: { userId: req.user.id },
      include: [{ model: Snippet }],
      order: [['createdAt', 'DESC']],
    });

    res.json(collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/collections/:id
// @desc    Get a single collection by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
      const collection = await Collection.findByPk(req.params.id, {
        include: [{ model: Snippet }], // Include associated snippets
      });
  
      if (!collection || collection.userId !== req.user.id) {
        return res.status(404).json({ msg: 'Collection not found' });
      }
  
      res.json(collection);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
// @route   PUT /api/collections/:id
// @desc    Update a collection by ID
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, description } = req.body;

  try {
    let collection = await Collection.findByPk(req.params.id);

    if (!collection || collection.userId !== req.user.id) {
      return res.status(404).json({ msg: 'Collection not found' });
    }

    collection.name = name || collection.name;
    collection.description = description || collection.description;

    await collection.save();

    res.json(collection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/collections/:id
// @desc    Delete a collection by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection || collection.userId !== req.user.id) {
      return res.status(404).json({ msg: 'Collection not found' });
    }

    await collection.destroy();
    res.json({ msg: 'Collection removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/collections/:id/snippets
// @desc    Add a snippet to a collection
// @access  Private
router.post('/:id/snippets', auth, async (req, res) => {
  const { snippetId } = req.body;

  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection || collection.userId !== req.user.id) {
      return res.status(404).json({ msg: 'Collection not found' });
    }

    const snippet = await Snippet.findByPk(snippetId);

    if (!snippet) {
      return res.status(404).json({ msg: 'Snippet not found' });
    }

    await collection.addSnippet(snippet);

    res.json({ msg: 'Snippet added to collection' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
