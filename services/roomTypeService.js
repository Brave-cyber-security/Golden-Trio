const pool = require('../connection');

class RoomTypeService {
  async getAllRoomTypes() {
    const result = await pool.query(`
      SELECT rt.*, h.name as hotel_name 
      FROM room_types rt 
      LEFT JOIN hotels h ON rt.hotel_id = h.id 
      ORDER BY rt.id
    `);
    return result.rows;
  }

  async getRoomTypeById(id) {
    const result = await pool.query(`
      SELECT rt.*, h.name as hotel_name 
      FROM room_types rt 
      LEFT JOIN hotels h ON rt.hotel_id = h.id 
      WHERE rt.id = $1
    `, [id]);
    return result.rows[0];
  }

  async getRoomsByRoomType(roomTypeId) {
    const result = await pool.query(`
      SELECT r.*, rt.type_name, h.name as hotel_name
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN hotels h ON r.hotel_id = h.id
      WHERE rt.id = $1
      ORDER BY r.room_number
    `, [roomTypeId]);
    return result.rows;
  }

  async createRoomType(data) {
    const { hotel_id, type_name, description, base_price } = data;
    const result = await pool.query(
      'INSERT INTO room_types (hotel_id, type_name, description, base_price) VALUES ($1, $2, $3, $4) RETURNING *',
      [hotel_id, type_name, description || null, base_price || null]
    );
    return result.rows[0];
  }

  async updateRoomType(id, data) {
    const { hotel_id, type_name, description, base_price } = data;
    const fields = [];
    const values = [];

    if (hotel_id !== undefined) {
      fields.push(`hotel_id = $${fields.length + 1}`);
      values.push(hotel_id);
    }
    if (type_name !== undefined) {
      fields.push(`type_name = $${fields.length + 1}`);
      values.push(type_name);
    }
    if (description !== undefined) {
      fields.push(`description = $${fields.length + 1}`);
      values.push(description);
    }
    if (base_price !== undefined) {
      fields.push(`base_price = $${fields.length + 1}`);
      values.push(base_price);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const sql = `UPDATE room_types SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`;
    const result = await pool.query(sql, values);
    return result.rows[0];
  }

  async deleteRoomType(id) {
    const result = await pool.query('DELETE FROM room_types WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = new RoomTypeService();
