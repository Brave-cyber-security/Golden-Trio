const pool = require('../connection');

class CustomerService {
  async getAllCustomers() {
    const result = await pool.query('SELECT * FROM customers ORDER BY id');
    return result.rows;
  }

  async getCustomerById(id) {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    return result.rows[0];
  }

  async createCustomer(data) {
    const { first_name, last_name, email, phone, address } = data;
    const result = await pool.query(
      'INSERT INTO customers (first_name, last_name, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [first_name, last_name, email, phone || null, address || null]
    );
    return result.rows[0];
  }

  async updateCustomer(id, data) {
    const { first_name, last_name, email, phone, address } = data;
    const fields = [];
    const values = [];

    if (first_name !== undefined) {
      fields.push(`first_name = $${fields.length + 1}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      fields.push(`last_name = $${fields.length + 1}`);
      values.push(last_name);
    }
    if (email !== undefined) {
      fields.push(`email = $${fields.length + 1}`);
      values.push(email);
    }
    if (phone !== undefined) {
      fields.push(`phone = $${fields.length + 1}`);
      values.push(phone);
    }
    if (address !== undefined) {
      fields.push(`address = $${fields.length + 1}`);
      values.push(address);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const sql = `UPDATE customers SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`;
    const result = await pool.query(sql, values);
    return result.rows[0];
  }

  async deleteCustomer(id) {
    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = new CustomerService();
