require('dotenv').config();
const express = require('express');
const hotelRoutes = require('./routes/hotelRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/hotels', hotelRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hotel API', 
    endpoints: {
      hotels: '/hotels'
    }
  });
});

app.listen(port, () => {
  console.log(`Hotel API listening on http://localhost:${port}`);
});
