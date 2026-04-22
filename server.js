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

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/passkey", require("./routes/passkeyRoutes"));


app.use("/api/products", require("./routes/productRoutes"));


app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running...");
});