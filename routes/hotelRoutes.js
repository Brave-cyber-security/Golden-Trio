const express = require('express');
const router = express.Router();
const hotelService = require('../services/hotelService');

// GET all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await hotelService.getAllHotels();
    res.json(hotels);
  } catch (err) {
    console.error('Failed to list hotels:', err);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// GET hotel by ID
router.get('/:id', async (req, res) => {
  try {
    const hotel = await hotelService.getHotelById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    res.json(hotel);
  } catch (err) {
    console.error('Failed to fetch hotel:', err);
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
});

// POST create new hotel
router.post('/', async (req, res) => {
  try {
    const { name, location } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }
    
    const hotel = await hotelService.createHotel(req.body);
    res.status(201).json(hotel);
  } catch (err) {
    console.error('Failed to create hotel:', err);
    res.status(500).json({ error: 'Failed to create hotel' });
  }
});

// PUT update hotel
router.put('/:id', async (req, res) => {
  try {
    const hotel = await hotelService.updateHotel(req.params.id, req.body);
    
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    res.json(hotel);
  } catch (err) {
    if (err.message === 'No fields to update') {
      return res.status(400).json({ error: 'Provide at least one field to update' });
    }
    
    console.error('Failed to update hotel:', err);
    res.status(500).json({ error: 'Failed to update hotel' });
  }
});

// DELETE hotel
router.delete('/:id', async (req, res) => {
  try {
    const hotel = await hotelService.deleteHotel(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    res.json({ message: 'Hotel deleted successfully', hotel });
  } catch (err) {
    console.error('Failed to delete hotel:', err);
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
});

module.exports = router;
