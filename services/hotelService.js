const pool = require('../connection');

class HotelService {
  async getAllHotels() {
    const result = await pool.query('SELECT * FROM hotels ORDER BY id');
    return result.rows;
  }

  async getHotelById(id) {
    const result = await pool.query('SELECT * FROM hotels WHERE id = $1', [id]);
    return result.rows[0];
  }

  async createHotel(hotelData) {
    const { name, location, rating, price_per_night, description } = hotelData;
    
    const result = await pool.query(
      'INSERT INTO hotels (name, location, rating, price_per_night, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, location, rating || null, price_per_night || null, description || null]
    );
    
    return result.rows[0];
  }

  async updateHotel(id, hotelData) {
    const { name, location, rating, price_per_night, description } = hotelData;
    
    const fields = [];
    const values = [];
    
    if (name !== undefined) {
      fields.push(`name = $${fields.length + 1}`);
      values.push(name);
    }
    
    if (location !== undefined) {
      fields.push(`location = $${fields.length + 1}`);
      values.push(location);
    }
    
    if (rating !== undefined) {
      fields.push(`rating = $${fields.length + 1}`);
      values.push(rating);
    }
    
    if (price_per_night !== undefined) {
      fields.push(`price_per_night = $${fields.length + 1}`);
      values.push(price_per_night);
    }
    
    if (description !== undefined) {
      fields.push(`description = $${fields.length + 1}`);
      values.push(description);
    }
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    values.push(id);
    
    const sql = `UPDATE hotels SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`;
    
    const result = await pool.query(sql, values);
    return result.rows[0];
  }

  async deleteHotel(id) {
    const result = await pool.query('DELETE FROM hotels WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = new HotelService();
