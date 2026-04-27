const express =
  require("express");

const dotenv =
  require("dotenv");

const cors =
  require("cors");

const session =
  require(
    "express-session"
  );

const passport =
  require("passport");

dotenv.config();

const connectDB =
  require("./config/db");

require(
  "./config/passport"
);

connectDB();

const app =
  express();

/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shopping-cart-frontend-psi.vercel.app"
      ],     
       credentials: true,
  })
);

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  "/uploads",
  express.static(
    "uploads"
  )
);

app.use(
  session({
    secret:
      process.env
        .SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  passport.initialize()
);

app.use(
  passport.session()
);

/* =========================
   ROUTES
========================= */

/* Auth */
app.use(
  "/api/auth",
  require(
    "./routes/authRoutes"
  )
);

/* NEW USER SETTINGS + SECURITY */
app.use(
  "/api/user",
  require(
    "./routes/userRoutes"
  )
);

/* Passkey */
app.use(
  "/api/passkey",
  require(
    "./routes/passkeyRoutes"
  )
);

/* Products */
app.use(
  "/api/products",
  require(
    "./routes/productRoutes"
  )
);

/* Categories */
app.use(
  "/api/categories",
  require(
    "./routes/categoryRoutes"
  )
);

/* Dashboard */
app.use(
  "/api/dashboard",
  require(
    "./routes/dashboardRoutes"
  )
);

/* Orders */
app.use(
  "/api/orders",
  require(
    "./routes/orderRoutes"
  )
);

/* Cart */
app.use(
  "/api/cart",
  require(
    "./routes/cartRoutes"
  )
);

/* Root */
app.get(
  "/",
  (req, res) => {
    res.send(
      "FreshCart Backend Running..."
    );
  }
);

/* =========================
   START SERVER
========================= */

const PORT =
  process.env.PORT ||
  5000;

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);