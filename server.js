const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

dotenv.config();

const connectDB = require("./config/db");
require("./config/passport");

// Connect Database
connectDB();

const app = express();

/* =========================
   Middleware
========================= */

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Upload Folder
app.use("/uploads", express.static("uploads"));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());

/* =========================
   Routes
========================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/passkey", require("./routes/passkeyRoutes"));

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

app.use("/api/dashboard", require("./routes/dashboardRoutes"));

/* =========================
   Test Route
========================= */

app.get("/", (req, res) => {
  res.send("Backend API Running...");
});

/* =========================
   Server Start
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});