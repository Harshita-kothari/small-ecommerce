const authRoutes = require("./routes/auth.routes");

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const productRoutes = require("./routes/product.routes");
dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "https://small-ecommerce-6pojscfoq.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // Local machine par server start hoga
    if (require.main === module) {
      app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
      });
    }
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

module.exports = app;