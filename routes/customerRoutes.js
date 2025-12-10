const express = require('express');
const router = express.Router();
const customerService = require('../services/customerService');

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  } catch (err) {
    console.error('Failed to list customers:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error('Failed to fetch customer:', err);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// POST create customer
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ error: 'first_name, last_name and email are required' });
    }
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (err) {
    console.error('Failed to create customer:', err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PUT update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    if (err.message === 'No fields to update') {
      return res.status(400).json({ error: 'Provide at least one field to update' });
    }
    console.error('Failed to update customer:', err);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await customerService.deleteCustomer(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully', customer });
  } catch (err) {
    console.error('Failed to delete customer:', err);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

module.exports = router;
