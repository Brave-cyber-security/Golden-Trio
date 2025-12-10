const pool = require('./connection');

async function createHotelsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        rating DECIMAL(2,1),
        price_per_night DECIMAL(10,2),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Hotels table created successfully!');
    
    // Insert sample data
    await pool.query(`
      INSERT INTO hotels (name, location, rating, price_per_night, description)
      VALUES 
        ('Grand Hotel', 'Tashkent', 4.5, 150.00, 'Luxury hotel in the heart of Tashkent'),
        ('Samarkand Plaza', 'Samarkand', 4.8, 200.00, 'Beautiful hotel near Registan Square'),
        ('Bukhara Palace', 'Bukhara', 4.3, 120.00, 'Traditional hotel in old city')
      ON CONFLICT DO NOTHING
    `);
    
    console.log('Sample data inserted!');
    
    await pool.end();
  } catch (err) {
    console.error('Error creating table:', err);
    await pool.end();
  }
}

createHotelsTable();
