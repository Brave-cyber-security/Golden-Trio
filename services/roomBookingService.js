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
