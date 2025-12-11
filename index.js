require('dotenv').config();
const express = require('express');
const hotelRoutes = require('./routes/hotelRoutes');
const roomTypeRoutes = require('./routes/roomTypeRoutes');
const roomRoutes = require('./routes/roomRoutes');
const customerRoutes = require('./routes/customerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/hotels', hotelRoutes);
app.use('/roomtypes', roomTypeRoutes);
app.use('/rooms', roomRoutes);
app.use('/customers', customerRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hotel Management API', 
    endpoints: {
      hotels: '/hotels',
      roomTypes: '/roomtypes',
      rooms: '/rooms',
      customers: '/customers',
      bookings: '/bookings',
      payments: '/payments',
      reviews: '/reviews'
    }
  });
});

app.listen(port, () => {
  console.log(`Hotel API listening on http://localhost:${port}`);
});
