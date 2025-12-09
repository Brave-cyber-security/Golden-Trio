import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:productId", getProductById);
router.post("/new", createProduct);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);

export default router;
