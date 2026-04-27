const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  customerName: String,
  phone: String,
  address: String,
  city: String,
  postalCode: String,

  items: [
    {
      productId: String,
      name: String,
      image: String,
      price: Number,
      qty: Number,
    },
  ],

  subtotal: Number,
  shipping: Number,
  total: Number,

  status: {
    type: String,
    default: "Pending",
  },
},
{ timestamps: true }
);

module.exports =
mongoose.model("Order", orderSchema);