const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

const connectDB = require("./config/db");
require("./config/passport");

connectDB();

const app = express();

/* ===============================
   CORS
================================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/* ===============================
   BODY PARSER
================================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   SESSION
================================= */
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

/* ===============================
   PASSPORT
================================= */
app.use(passport.initialize());

/* ===============================
   STATIC UPLOADS
================================= */
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

/* ===============================
   ROUTES
================================= */
app.get("/", (req, res) => {
  res.send("FreshCart Backend Running...");
});

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/passkey",
  require("./routes/passkeyRoutes")
);

app.use(
  "/api/products",
  require("./routes/productRoutes")
);

app.use(
  "/api/dashboard",
  require("./routes/dashboardRoutes")
);

/* ===============================
   START SERVER
================================= */
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});