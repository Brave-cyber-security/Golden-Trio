const express = require('express');
const router = express.Router();
const roomService = require('../services/roomService');

// GET all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
  } catch (err) {
    console.error('Failed to list rooms:', err);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// GET room by ID with room type info
router.get('/:id', async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    console.error('Failed to fetch room:', err);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// POST create room
router.post('/', async (req, res) => {
  try {
    const { hotel_id, room_number } = req.body;
    if (!hotel_id || !room_number) {
      return res.status(400).json({ error: 'hotel_id and room_number are required' });
    }
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (err) {
    console.error('Failed to create room:', err);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// PUT update room
router.put('/:id', async (req, res) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    if (err.message === 'No fields to update') {
      return res.status(400).json({ error: 'Provide at least one field to update' });
    }
    console.error('Failed to update room:', err);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// DELETE room
router.delete('/:id', async (req, res) => {
  try {
    const room = await roomService.deleteRoom(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully', room });
  } catch (err) {
    console.error('Failed to delete room:', err);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

module.exports = router;
