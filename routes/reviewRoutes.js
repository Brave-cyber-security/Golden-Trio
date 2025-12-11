const express = require('express');
const router = express.Router();
const reviewService = require('../services/reviewService');

// GET all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.json(reviews);
  } catch (err) {
    console.error('Failed to list reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (err) {
    console.error('Failed to fetch review:', err);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// PUT update review
router.put('/:id', async (req, res) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.body);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (err) {
    if (err.message === 'No fields to update') {
      return res.status(400).json({ error: 'Provide at least one field to update' });
    }
    console.error('Failed to update review:', err);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE review
router.delete('/:id', async (req, res) => {
  try {
    const review = await reviewService.deleteReview(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully', review });
  } catch (err) {
    console.error('Failed to delete review:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
