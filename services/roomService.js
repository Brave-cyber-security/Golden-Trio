const pool = require('../connection');

class RoomService {
  async getAllRooms() {
    const result = await pool.query(`
      SELECT r.*, rt.type_name, rt.base_price, h.name as hotel_name
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      ORDER BY r.id
    `);
    return result.rows;
  }

  async getRoomById(id) {
    const result = await pool.query(`
      SELECT r.*, rt.type_name, rt.base_price, rt.description as room_type_description, 
             h.name as hotel_name, h.location
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      WHERE r.id = $1
    `, [id]);
    return result.rows[0];
  }

  async createRoom(data) {
    const { hotel_id, room_type_id, room_number, floor, status } = data;
    const result = await pool.query(
      'INSERT INTO rooms (hotel_id, room_type_id, room_number, floor, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [hotel_id, room_type_id || null, room_number, floor || null, status || 'available']
    );
    return result.rows[0];
  }

  async updateRoom(id, data) {
    const { hotel_id, room_type_id, room_number, floor, status } = data;
    const fields = [];
    const values = [];

    if (hotel_id !== undefined) {
      fields.push(`hotel_id = $${fields.length + 1}`);
      values.push(hotel_id);
    }
    if (room_type_id !== undefined) {
      fields.push(`room_type_id = $${fields.length + 1}`);
      values.push(room_type_id);
    }
    if (room_number !== undefined) {
      fields.push(`room_number = $${fields.length + 1}`);
      values.push(room_number);
    }
    if (floor !== undefined) {
      fields.push(`floor = $${fields.length + 1}`);
      values.push(floor);
    }
    if (status !== undefined) {
      fields.push(`status = $${fields.length + 1}`);
      values.push(status);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const sql = `UPDATE rooms SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`;
    const result = await pool.query(sql, values);
    return result.rows[0];
  }

  async deleteRoom(id) {
    const result = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = new RoomService();
