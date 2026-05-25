const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const adminRoutes = require("./routes/admin");
const mediaRoutes = require("./routes/mediaRoutes");
const productRoutes = require("./routes/productRoutes");  
const seoRoutes = require("./routes/seoRoutes");

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length
      ? (origin, cb) => {
          if (!origin || corsOrigins.includes(origin)) return cb(null, true);
          return cb(null, false);
        }
      : true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/admin", adminRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/product", productRoutes); 
app.use("/api/seo", seoRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
db.ensureSchema()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to initialize database schema:", err.message);
    if (err.code === "ECONNREFUSED") {
      console.error(
        "Hint: MySQL is not accepting connections. Start MySQL (e.g. Windows Services / XAMPP) and check DB_HOST and DB_PORT in .env."
      );
    } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Hint: Wrong DB_USER or DB_PASSWORD in .env.");
    } else if (err.code === "ER_BAD_DB_ERROR") {
      console.error(
        "Hint: Database in DB_NAME does not exist. Create it in MySQL, then restart the server."
      );
    }
    process.exit(1);
  });
