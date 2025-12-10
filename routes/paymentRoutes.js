const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');

// GET all payments
router.get('/', async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json(payments);
  } catch (err) {
    console.error('Failed to list payments:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// GET payment by ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (err) {
    console.error('Failed to fetch payment:', err);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// GET booking + customer info for a payment
router.get('/:id/booking', async (req, res) => {
  try {
    const booking = await paymentService.getBookingByPaymentId(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found for this payment' });
    }
    res.json(booking);
  } catch (err) {
    console.error('Failed to fetch booking:', err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

module.exports = router;
