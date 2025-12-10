const express = require('express');
const router = express.Router();
const roomTypeService = require('../services/roomTypeService');

// GET all room types
router.get('/', async (req, res) => {
  try {
    const roomTypes = await roomTypeService.getAllRoomTypes();
    res.json(roomTypes);
  } catch (err) {
    console.error('Failed to list room types:', err);
    res.status(500).json({ error: 'Failed to fetch room types' });
  }
});

// GET room type by ID
router.get('/:id', async (req, res) => {
  try {
    const roomType = await roomTypeService.getRoomTypeById(req.params.id);
    if (!roomType) {
      return res.status(404).json({ error: 'Room type not found' });
    }
    res.json(roomType);
  } catch (err) {
    console.error('Failed to fetch room type:', err);
    res.status(500).json({ error: 'Failed to fetch room type' });
  }
});

// GET all rooms of a specific room type
router.get('/:id/rooms', async (req, res) => {
  try {
    const rooms = await roomTypeService.getRoomsByRoomType(req.params.id);
    res.json(rooms);
  } catch (err) {
    console.error('Failed to fetch rooms:', err);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// POST create room type
router.post('/', async (req, res) => {
  try {
    const { hotel_id, type_name } = req.body;
    if (!hotel_id || !type_name) {
      return res.status(400).json({ error: 'hotel_id and type_name are required' });
    }
    const roomType = await roomTypeService.createRoomType(req.body);
    res.status(201).json(roomType);
  } catch (err) {
    console.error('Failed to create room type:', err);
    res.status(500).json({ error: 'Failed to create room type' });
  }
});

// PUT update room type
router.put('/:id', async (req, res) => {
  try {
    const roomType = await roomTypeService.updateRoomType(req.params.id, req.body);
    if (!roomType) {
      return res.status(404).json({ error: 'Room type not found' });
    }
    res.json(roomType);
  } catch (err) {
    if (err.message === 'No fields to update') {
      return res.status(400).json({ error: 'Provide at least one field to update' });
    }
    console.error('Failed to update room type:', err);
    res.status(500).json({ error: 'Failed to update room type' });
  }
});

// DELETE room type
router.delete('/:id', async (req, res) => {
  try {
    const roomType = await roomTypeService.deleteRoomType(req.params.id);
    if (!roomType) {
      return res.status(404).json({ error: 'Room type not found' });
    }
    res.json({ message: 'Room type deleted successfully', roomType });
  } catch (err) {
    console.error('Failed to delete room type:', err);
    res.status(500).json({ error: 'Failed to delete room type' });
  }
});

module.exports = router;
