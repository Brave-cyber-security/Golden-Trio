const pool = require('../connection');

class ReviewService {
  async getAllReviews() {
    const result = await pool.query(`
      SELECT r.*, 
             ro.room_number, rt.type_name,
             c.first_name, c.last_name, c.email
      FROM reviews r
      LEFT JOIN rooms ro ON r.room_id = ro.id
      LEFT JOIN room_types rt ON ro.room_type_id = rt.id
      LEFT JOIN customers c ON r.customer_id = c.id
      ORDER BY r.created_at DESC
    `);
    return result.rows;
  }

  async getReviewById(id) {
    const result = await pool.query(`
      SELECT r.*, 
             ro.room_number, rt.type_name, h.name as hotel_name,
             c.first_name, c.last_name, c.email
      FROM reviews r
      LEFT JOIN rooms ro ON r.room_id = ro.id
      LEFT JOIN room_types rt ON ro.room_type_id = rt.id
      LEFT JOIN hotels h ON ro.hotel_id = h.id
      LEFT JOIN customers c ON r.customer_id = c.id
      WHERE r.id = $1
    `, [id]);
    return result.rows[0];
  }

  async getReviewsByRoomId(roomId) {
    const result = await pool.query(`
      SELECT r.*, c.first_name, c.last_name, c.email
      FROM reviews r
      JOIN customers c ON r.customer_id = c.id
      WHERE r.room_id = $1
      ORDER BY r.created_at DESC
    `, [roomId]);
    return result.rows;
  }

  async getReviewsByCustomerId(customerId) {
    const result = await pool.query(`
      SELECT r.*, ro.room_number, rt.type_name, h.name as hotel_name
      FROM reviews r
      JOIN rooms ro ON r.room_id = ro.id
      JOIN room_types rt ON ro.room_type_id = rt.id
      JOIN hotels h ON ro.hotel_id = h.id
      WHERE r.customer_id = $1
      ORDER BY r.created_at DESC
    `, [customerId]);
    return result.rows;
  }

  async createReview(data) {
    const { room_id, customer_id, rating, comment } = data;
    const result = await pool.query(
      'INSERT INTO reviews (room_id, customer_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [room_id, customer_id, rating, comment || null]
    );
    return result.rows[0];
  }

  async updateReview(id, data) {
    const { rating, comment } = data;
    const fields = [];
    const values = [];

    if (rating !== undefined) {
      fields.push(`rating = $${fields.length + 1}`);
      values.push(rating);
    }
    if (comment !== undefined) {
      fields.push(`comment = $${fields.length + 1}`);
      values.push(comment);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const sql = `UPDATE reviews SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`;
    const result = await pool.query(sql, values);
    return result.rows[0];
  }

  async deleteReview(id) {
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = new ReviewService();
