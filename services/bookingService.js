const pool = require('../connection');

class BookingService {
  async getAllBookings() {
    const result = await pool.query(`
      SELECT b.*, 
             c.first_name, c.last_name, c.email,
             COUNT(rb.room_id) as room_count
      FROM bookings b
      LEFT JOIN customers c ON b.customer_id = c.id
      LEFT JOIN room_bookings rb ON b.id = rb.booking_id
      GROUP BY b.id, c.first_name, c.last_name, c.email
      ORDER BY b.id
    `);
    return result.rows;
  }

  async getBookingById(id) {
    const result = await pool.query(`
      SELECT b.*, 
             c.first_name, c.last_name, c.email, c.phone,
             json_agg(json_build_object(
               'room_id', r.id,
               'room_number', r.room_number,
               'type_name', rt.type_name,
               'price', rb.price
             )) as rooms
      FROM bookings b
      LEFT JOIN customers c ON b.customer_id = c.id
      LEFT JOIN room_bookings rb ON b.id = rb.booking_id
      LEFT JOIN rooms r ON rb.room_id = r.id
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      WHERE b.id = $1
      GROUP BY b.id, c.first_name, c.last_name, c.email, c.phone
    `, [id]);
    return result.rows[0];
  }

  async createBooking(data) {
    const { customer_id, check_in_date, check_out_date, total_amount, status, room_ids } = data;
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Create booking
      const bookingResult = await client.query(
        'INSERT INTO bookings (customer_id, check_in_date, check_out_date, total_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [customer_id, check_in_date, check_out_date, total_amount || 0, status || 'pending']
      );
      
      const booking = bookingResult.rows[0];
      
      // Add rooms to booking if provided
      if (room_ids && Array.isArray(room_ids)) {
        for (const roomId of room_ids) {
          await client.query(
            'INSERT INTO room_bookings (booking_id, room_id, price) VALUES ($1, $2, $3)',
            [booking.id, roomId, 0]
          );
        }
      }
      
      await client.query('COMMIT');
      return booking;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async updateBooking(id, data) {
    const { customer_id, check_in_date, check_out_date, total_amount, status } = data;
    const fields = [];
    const values = [];

    if (customer_id !== undefined) {
      fields.push(`customer_id = $${fields.length + 1}`);
      values.push(customer_id);
    }
    if (check_in_date !== undefined) {
      fields.push(`check_in_date = $${fields.length + 1}`);
      values.push(check_in_date);
    }
    if (check_out_date !== undefined) {
      fields.push(`check_out_date = $${fields.length + 1}`);
      values.push(check_out_date);
    }
    if (total_amount !== undefined) {
      fields.push(`total_amount = $${fields.length + 1}`);
      values.push(total_amount);
    }
    if (status !== undefined) {
      fields.push(`status = $${fields.length + 1}`);
      values.push(status);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const sql = `UPDATE bookings SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`;
    const result = await pool.query(sql, values);
    return result.rows[0];
  }

  async deleteBooking(id) {
    const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = new BookingService();
