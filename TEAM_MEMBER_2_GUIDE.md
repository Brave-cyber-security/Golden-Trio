# Team Member 2 - Room Bookings & Additional Joins Implementation Guide

## Your Task
Implement Room_Bookings junction table operations and additional join endpoints.

## 1. Create services/roomBookingService.js

```javascript
const pool = require('../connection');

class RoomBookingService {
  async assignRoomToBooking(bookingId, roomId, price) {
    const result = await pool.query(
      'INSERT INTO room_bookings (booking_id, room_id, price) VALUES ($1, $2, $3) RETURNING *',
      [bookingId, roomId, price || 0]
    );
    return result.rows[0];
  }

  async removeRoomFromBooking(bookingId, roomId) {
    const result = await pool.query(
      'DELETE FROM room_bookings WHERE booking_id = $1 AND room_id = $2 RETURNING *',
      [bookingId, roomId]
    );
    return result.rows[0];
  }

  async getBookingsByRoomId(roomId) {
    const result = await pool.query(`
      SELECT b.*, c.first_name, c.last_name, c.email, c.phone,
             rb.price as room_price
      FROM room_bookings rb
      JOIN bookings b ON rb.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      WHERE rb.room_id = $1
      ORDER BY b.check_in_date DESC
    `, [roomId]);
    return result.rows;
  }

  async getBookingsByCustomerId(customerId) {
    const result = await pool.query(`
      SELECT b.*, 
             json_agg(json_build_object(
               'room_id', r.id,
               'room_number', r.room_number,
               'type_name', rt.type_name,
               'hotel_name', h.name,
               'price', rb.price
             )) as rooms
      FROM bookings b
      LEFT JOIN room_bookings rb ON b.id = rb.booking_id
      LEFT JOIN rooms r ON rb.room_id = r.id
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      WHERE b.customer_id = $1
      GROUP BY b.id
      ORDER BY b.check_in_date DESC
    `, [customerId]);
    return result.rows;
  }
}

module.exports = new RoomBookingService();
```

## 2. Update routes/bookingRoutes.js - Add these endpoints:

```javascript
const roomBookingService = require('../services/roomBookingService');

// Add after existing routes, before module.exports:

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
```

## 3. Update routes/roomRoutes.js - Add this endpoint:

```javascript
const roomBookingService = require('../services/roomBookingService');

// Add after existing routes, before module.exports:

// GET all bookings for a specific room
router.get('/:id/bookings', async (req, res) => {
  try {
    const bookings = await roomBookingService.getBookingsByRoomId(req.params.id);
    res.json(bookings);
  } catch (err) {
    console.error('Failed to fetch bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});
```

## 4. Update routes/customerRoutes.js - Add this endpoint:

```javascript
const roomBookingService = require('../services/roomBookingService');

// Add after existing routes, before module.exports:

// GET all bookings of a customer with rooms info
router.get('/:id/bookings', async (req, res) => {
  try {
    const bookings = await roomBookingService.getBookingsByCustomerId(req.params.id);
    res.json(bookings);
  } catch (err) {
    console.error('Failed to fetch bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});
```

## Steps to Complete:
1. Create `services/roomBookingService.js`
2. Update `routes/bookingRoutes.js` - add the require and 2 endpoints
3. Update `routes/roomRoutes.js` - add the require and 1 endpoint
4. Update `routes/customerRoutes.js` - add the require and 1 endpoint
5. Test all endpoints
6. Commit and push to your branch

## Testing Examples:

### Assign room to booking:
```
POST http://localhost:3000/bookings/1/rooms/2
Content-Type: application/json

{
  "price": 150.00
}
```

### Remove room from booking:
```
DELETE http://localhost:3000/bookings/1/rooms/2
```

### Get bookings for a room:
```
GET http://localhost:3000/rooms/1/bookings
```

### Get customer bookings with rooms:
```
GET http://localhost:3000/customers/1/bookings
```
