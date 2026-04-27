# Shopping Cart Backend

This is the Express and MongoDB backend for the shopping cart application. It provides authentication, product and category management, cart operations, passkey support, and admin dashboard APIs.

## Features

- User authentication
- Google OAuth login
- Facebook OAuth login
- Passkey support
- Product CRUD APIs
- Category CRUD APIs
- Cart management APIs
- Admin dashboard APIs
- Static upload file serving

## Technology Stack

- Node.js
- Express
- MongoDB
- Mongoose
- Passport.js
- Passport Google OAuth 2.0
- Passport Facebook OAuth
- SimpleWebAuthn server
- Multer for uploads

## Project Structure

```text
backend/
├── server.js
├── package.json
├── createAdmin.js
├── config/
│   ├── db.js
│   └── passport.js
├── controllers/
│   ├── authController.js
│   ├── cartController.js
│   ├── categoryController.js
│   ├── dashboardController.js
│   ├── orderController.js
│   ├── passkeyController.js
│   ├── productController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── Cart.js
│   ├── Category.js
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   ├── dashboardRoutes.js
│   ├── orderRoutes.js
│   ├── passkeyRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── uploads/
└── utils/
    └── generateToken.js
```

## Main Flow

1. `server.js` loads environment variables and connects to MongoDB.
2. Passport is configured in `config/passport.js`.
3. The API is exposed through route files under `routes/`.
4. Controllers handle authentication, product management, category management, cart operations, and dashboard data.
5. Uploaded product images are served from the `uploads/` folder.

## Setup

### Prerequisites

- Node.js
- MongoDB

### Install and Run

```bash
cd backend
npm install
npm run dev
```

### Production Start

```bash
npm start
```

## Environment Variables

Typical backend configuration includes:

- `PORT`
- `CLIENT_URL`
- `SESSION_SECRET`
- `MONGO_URI`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`

## API Routes

- `/api/auth` for authentication
- `/api/passkey` for passkey operations
- `/api/products` for product management and browsing
- `/api/categories` for category management
- `/api/dashboard` for admin dashboard data
- Cart operations are handled through the cart controller and cart routes

## Notes

- The backend serves uploaded images from `/uploads`.
- OAuth callback URLs are configured in `config/passport.js`.
- Cart logic is implemented in the controller and route layer used by the frontend cart pages.
