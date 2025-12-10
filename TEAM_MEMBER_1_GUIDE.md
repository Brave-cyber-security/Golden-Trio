# Team Member 1 - Reviews Module Implementation Guide

## Your Task
Implement the Reviews module with full CRUD operations and join endpoints.

## 1. Create services/reviewService.js

```javascript
const pool = require('../connection');

class ReviewService {
  async getAllReviews() {
    const result = await pool.query(`
      SELECT r.*, 
             ro.room_number, rt.type_name,
             c.first_name, c.last_name, c.email
      FROM reviews r
      LEFT JOIN rooms ro ON r.room_id = ro.id
      LEFT JOIN room_types rt ON ro.room_type_id = rt.id
      LEFT JOIN customers c ON r.customer_id = c.id
      ORDER BY r.created_at DESC
    `);
    return result.rows;
  }

  async getReviewById(id) {
    const result = await pool.query(`
      SELECT r.*, 
             ro.room_number, rt.type_name, h.name as hotel_name,
             c.first_name, c.last_name, c.email
      FROM reviews r
      LEFT JOIN rooms ro ON r.room_id = ro.id
      LEFT JOIN room_types rt ON ro.room_type_id = rt.id
      LEFT JOIN hotels h ON ro.hotel_id = h.id
      LEFT JOIN customers c ON r.customer_id = c.id
      WHERE r.id = $1
    `, [id]);
    return result.rows[0];
  }

  async getReviewsByRoomId(roomId) {
    const result = await pool.query(`
      SELECT r.*, c.first_name, c.last_name, c.email
      FROM reviews r
      JOIN customers c ON r.customer_id = c.id
      WHERE r.room_id = $1
      ORDER BY r.created_at DESC
    `, [roomId]);
    return result.rows;
  }

  async getReviewsByCustomerId(customerId) {
    const result = await pool.query(`
      SELECT r.*, ro.room_number, rt.type_name, h.name as hotel_name
      FROM reviews r
      JOIN rooms ro ON r.room_id = ro.id
      JOIN room_types rt ON ro.room_type_id = rt.id
      JOIN hotels h ON ro.hotel_id = h.id
      WHERE r.customer_id = $1
      ORDER BY r.created_at DESC
    `, [customerId]);
    return result.rows;
  }

  async createReview(data) {
    const { room_id, customer_id, rating, comment } = data;
    const result = await pool.query(
      'INSERT INTO reviews (room_id, customer_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [room_id, customer_id, rating, comment || null]
    );
    return result.rows[0];
  }

  async updateReview(id, data) {
    const { rating, comment } = data;
    const fields = [];
    const values = [];

    if (rating !== undefined) {
      fields.push(\`rating = $\${fields.length + 1}\`);
      values.push(rating);
    }
    if (comment !== undefined) {
      fields.push(\`comment = $\${fields.length + 1}\`);
      values.push(comment);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const sql = \`UPDATE reviews SET \${fields.join(', ')} WHERE id = $\${fields.length + 1} RETURNING *\`;
    const result = await pool.query(sql, values);
    return result.rows[0];
  }

  async deleteReview(id) {
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = new ReviewService();
```

## 2. Create routes/reviewRoutes.js

```javascript
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
```

## 3. Update routes/roomRoutes.js - Add these endpoints:

```javascript
const reviewService = require('../services/reviewService');

// Add after existing routes, before module.exports:

// GET all reviews for a room
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByRoomId(req.params.id);
    res.json(reviews);
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST create review for a room
router.post('/:id/reviews', async (req, res) => {
  try {
    const { customer_id, rating, comment } = req.body;
    if (!customer_id || !rating) {
      return res.status(400).json({ error: 'customer_id and rating are required' });
    }
    const review = await reviewService.createReview({
      room_id: req.params.id,
      customer_id,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (err) {
    console.error('Failed to create review:', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});
```

## 4. Update routes/customerRoutes.js - Add this endpoint:

```javascript
const reviewService = require('../services/reviewService');

// Add after existing routes, before module.exports:

// GET all reviews by a customer
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByCustomerId(req.params.id);
    res.json(reviews);
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});
```

## 5. Update index.js - Add review routes:

```javascript
const reviewRoutes = require('./routes/reviewRoutes');
app.use('/reviews', reviewRoutes);
```

## Steps to Complete:
1. Create the two files above
2. Update roomRoutes.js and customerRoutes.js
3. Update index.js
4. Test all endpoints
5. Commit and push to your branch
