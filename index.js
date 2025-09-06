import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(()=>
console.log("Mongodb connected"))
.catch((er)=> console.log(er))

// Product model
const Product = mongoose.model(
  "products",
  new mongoose.Schema({}, { strict: false })
);

// GET all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new product
app.post("/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product by ID
app.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
