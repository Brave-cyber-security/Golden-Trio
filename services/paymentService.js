const pool = require('../connection');

class PaymentService {
  async getAllPayments() {
    const result = await pool.query(`
      SELECT p.*, b.check_in_date, b.check_out_date, b.total_amount as booking_amount,
             c.first_name, c.last_name, c.email
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      LEFT JOIN customers c ON b.customer_id = c.id
      ORDER BY p.id
    `);
    return result.rows;
  }

  async getPaymentById(id) {
    const result = await pool.query(`
      SELECT p.*, b.check_in_date, b.check_out_date, b.total_amount as booking_amount,
             c.first_name, c.last_name, c.email, c.phone
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      LEFT JOIN customers c ON b.customer_id = c.id
      WHERE p.id = $1
    `, [id]);
    return result.rows[0];
  }

  async createPayment(data) {
    const { booking_id, amount, payment_method, status } = data;
    const result = await pool.query(
      'INSERT INTO payments (booking_id, amount, payment_method, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [booking_id, amount, payment_method || 'cash', status || 'completed']
    );
    return result.rows[0];
  }

  async getPaymentByBookingId(bookingId) {
    const result = await pool.query(`
      SELECT p.*, b.check_in_date, b.check_out_date, b.total_amount as booking_amount,
             c.first_name, c.last_name, c.email
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      WHERE p.booking_id = $1
    `, [bookingId]);
    return result.rows[0];
  }

  async getBookingByPaymentId(paymentId) {
    const result = await pool.query(`
      SELECT b.*, c.first_name, c.last_name, c.email, c.phone,
             p.amount as payment_amount, p.payment_method, p.payment_date
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      WHERE p.id = $1
    `, [paymentId]);
    return result.rows[0];
  }
}

module.exports = new PaymentService();
