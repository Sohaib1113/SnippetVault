const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Snippet = require('../models/Snippet');
const Version = require('../models/Version'); // Import Version model
const Comment = require('../models/Comment'); // Import Comment model
const { v4: uuidv4 } = require('uuid'); // To generate unique identifiers

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

// @route   GET /api/snippets
// @desc    Get all snippets for the logged-in user
// @access  Private
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
// @desc    Update a snippet by ID and create a new version
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, code, tags } = req.body;

  try {
    let snippet = await Snippet.findByPk(req.params.id);

    if (!snippet || snippet.userId !== req.user.id) {
      return res.status(404).json({ msg: 'Snippet not found' });
    }

    // Create a new version before updating the snippet
    const newVersion = new Version({
      content: snippet.code,
      snippetId: snippet.id,
    });
    await newVersion.save();

    // Update the snippet with new data
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

// @route   POST /api/snippets/:id/share
// @desc    Share a snippet with a public link and optional email
// @access  Private
router.post('/:id/share', auth, async (req, res) => {
  const { email } = req.body;  // Optional email to share with
  try {
    const snippet = await Snippet.findByPk(req.params.id);

    if (!snippet) {
      return res.status(404).json({ msg: 'Snippet not found' });
    }

    // Only the owner can share the snippet
    if (snippet.userId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Generate a unique shareable link
    snippet.shareableLink = uuidv4();
    snippet.isPublic = true; // Make the snippet public when shared
    snippet.sharedWithEmail = email || null; // Save the email if provided

    await snippet.save();
    res.json({ shareableLink: `${process.env.BASE_URL}/share/${snippet.shareableLink}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/snippets/share/:shareableLink
// @desc    Access shared snippet via shareable link
// @access  Public
router.get('/share/:shareableLink', async (req, res) => {
  try {
    const snippet = await Snippet.findOne({ where: { shareableLink: req.params.shareableLink } });

    if (!snippet) {
      return res.status(404).json({ msg: 'Snippet not found' });
    }

    res.json(snippet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/snippets/:id/fork
// @desc    Fork a snippet to create a new one based on it
// @access  Private
router.post('/:id/fork', auth, async (req, res) => {
  try {
    const originalSnippet = await Snippet.findByPk(req.params.id);

    if (!originalSnippet) {
      return res.status(404).json({ msg: 'Original snippet not found' });
    }

    const forkedSnippet = new Snippet({
      userId: req.user.id,
      title: `Forked: ${originalSnippet.title}`,
      description: originalSnippet.description,
      code: originalSnippet.code,
      tags: originalSnippet.tags,
      forkedFromSnippetId: originalSnippet.id, // Track the original snippet
    });

    await forkedSnippet.save();
    res.json(forkedSnippet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get version history of a snippet
router.get('/:snippetId/versions', auth, async (req, res) => {
  try {
    const versions = await Version.findAll({
      where: { snippetId: req.params.snippetId },
      order: [['createdAt', 'ASC']],
    });

    if (versions.length === 0) {
      return res.status(200).json([]); // No versions found, return an empty array
    }

    res.json(versions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a specific version of a snippet
router.get('/:snippetId/version/:versionId', auth, async (req, res) => {
  try {
    const version = await Version.findOne({
      where: {
        snippetId: req.params.snippetId,
        versionId: req.params.versionId,
      },
    });

    if (!version) {
      return res.status(404).json({ msg: 'Version not found' });
    }

    res.json(version);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get comments for a snippet
router.get('/:snippetId/comments', auth, async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { snippetId: req.params.snippetId },
      order: [['createdAt', 'ASC']],
    });

    if (comments.length === 0) {
      return res.status(200).json([]); // No comments found, return an empty array
    }

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a new comment to a snippet
router.post('/:snippetId/comments', auth, async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ msg: 'Content is required' });
  }

  try {
    const newComment = new Comment({
      content,
      snippetId: req.params.snippetId,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
