const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

const connectDB = require("./config/db");
require("./config/passport");

connectDB();

const app = express();

/* Middleware */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

/* Routes */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/passkey", require("./routes/passkeyRoutes"));

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

app.use("/api/dashboard", require("./routes/dashboardRoutes"));

/* Test Route */
app.get("/", (req, res) => {
  res.send("Backend API Running...");
});

/* Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});