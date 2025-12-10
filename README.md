# Hotel Management API - Golden Trio Project

## Team Members & Responsibilities

### Botir (80% - Main CRUD Operations)
✅ **Completed:**
1. Hotels - Full CRUD
2. RoomTypes - Full CRUD + GET /roomtypes/:id/rooms
3. Rooms - Full CRUD + GET /rooms/:id (with room type info)
4. Customers - Full CRUD
5. Bookings - Full CRUD + GET /bookings/:id/payment + POST /bookings/:id/payment
6. Payments - Full CRUD + GET /payments/:id/booking

### Team Member 1 (10% - Reviews Module)
**Todo:**
- Create `services/reviewService.js`
- Create `routes/reviewRoutes.js`
- Implement:
  - GET /reviews
  - GET /reviews/:id
  - POST /rooms/:roomId/reviews
  - PUT /reviews/:id
  - DELETE /reviews/:id
  - GET /rooms/:roomId/reviews
  - GET /customers/:customerId/reviews

### Team Member 2 (10% - Room Bookings & Additional Joins)
**Todo:**
- Create `services/roomBookingService.js`  
- Add endpoints to existing routes:
  - POST /bookings/:bookingId/rooms/:roomId
  - DELETE /bookings/:bookingId/rooms/:roomId
  - GET /rooms/:id/bookings
  - GET /customers/:id/bookings

## Database Setup

1. Open pgAdmin
2. Connect to Render database
3. Run `schema.sql` to create all tables

## API Endpoints

### Hotels
- GET /hotels
- GET /hotels/:id
- POST /hotels
- PUT /hotels/:id
- DELETE /hotels/:id

### Room Types
- GET /roomtypes
- GET /roomtypes/:id
- GET /roomtypes/:id/rooms
- POST /roomtypes
- PUT /roomtypes/:id
- DELETE /roomtypes/:id

### Rooms
- GET /rooms
- GET /rooms/:id
- POST /rooms
- PUT /rooms/:id
- DELETE /rooms/:id

### Customers
- GET /customers
- GET /customers/:id
- POST /customers
- PUT /customers/:id
- DELETE /customers/:id

### Bookings
- GET /bookings
- GET /bookings/:id
- GET /bookings/:id/payment
- POST /bookings
- POST /bookings/:id/payment
- PUT /bookings/:id
- DELETE /bookings/:id

### Payments
- GET /payments
- GET /payments/:id
- GET /payments/:id/booking

## Installation

```bash
npm install
node setup.js  # Create database tables
node index.js  # Start server
```

## Testing
Use Thunder Client or Postman to test endpoints at `http://localhost:3000`
