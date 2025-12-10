const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://hotel_y6dy_user:GORJC6p8SYd8tcq8q6WbEBTLtqcDiqoV@dpg-d4si0nf5r7bs739mvqng-a.frankfurt-postgres.render.com/hotel_y6dy',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
