import express from "express";
import dotenv from "dotenv";
import { initDatabase } from "./config/database.js";

import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config({ quiet: true });

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 7777;

// Initialize database before starting server
initDatabase();

// Routes
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(
    `Girgitton http://localhost:${PORT} manzilida xizmatga muntazir!`
  );
});