const express = require('express');
const router = express.Router();
const bookingService = require('../services/bookingService');
const paymentService = require('../services/paymentService');
const roomBookingService = require('../services/roomBookingService');

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (err) {
    console.error('Failed to list bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET booking by ID with customer and room info
router.get('/:id', async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error('Failed to fetch booking:', err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// POST create booking with multiple rooms
router.post('/', async (req, res) => {
  try {
    const { customer_id, check_in_date, check_out_date } = req.body;
    if (!customer_id || !check_in_date || !check_out_date) {
      return res.status(400).json({ error: 'customer_id, check_in_date and check_out_date are required' });
    }
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (err) {
    console.error('Failed to create booking:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// PUT update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    if (err.message === 'No fields to update') {
      return res.status(400).json({ error: 'Provide at least one field to update' });
    }
    console.error('Failed to update booking:', err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// DELETE booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await bookingService.deleteBooking(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully', booking });
  } catch (err) {
    console.error('Failed to delete booking:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// GET payment info for a booking
router.get('/:id/payment', async (req, res) => {
  try {
    const payment = await paymentService.getPaymentByBookingId(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found for this booking' });
    }
    res.json(payment);
  } catch (err) {
    console.error('Failed to fetch payment:', err);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// POST create payment for a booking
router.post('/:id/payment', async (req, res) => {
  try {
    const { amount, payment_method } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'amount is required' });
    }
    const payment = await paymentService.createPayment({
      booking_id: req.params.id,
      ...req.body
    });
    res.status(201).json(payment);
  } catch (err) {
    console.error('Failed to create payment:', err);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// POST assign a room to a booking
router.post('/:bookingId/rooms/:roomId', async (req, res) => {
  try {
    const { bookingId, roomId } = req.params;
    const { price } = req.body;
    
    const roomBooking = await roomBookingService.assignRoomToBooking(
      bookingId, 
      roomId, 
      price
    );
    res.status(201).json(roomBooking);
  } catch (err) {
    console.error('Failed to assign room to booking:', err);
    res.status(500).json({ error: 'Failed to assign room to booking' });
  }
});

// DELETE remove a room from a booking
router.delete('/:bookingId/rooms/:roomId', async (req, res) => {
  try {
    const { bookingId, roomId } = req.params;
    const roomBooking = await roomBookingService.removeRoomFromBooking(bookingId, roomId);
    
    if (!roomBooking) {
      return res.status(404).json({ error: 'Room booking not found' });
    }
    
    res.json({ message: 'Room removed from booking successfully', roomBooking });
  } catch (err) {
    console.error('Failed to remove room from booking:', err);
    res.status(500).json({ error: 'Failed to remove room from booking' });
  }
});

module.exports = router;
