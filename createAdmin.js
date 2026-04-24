const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const hashedPassword =
      await bcrypt.hash(
        "admin123",
        10
      );

    await User.deleteOne({
      email:
        "admin@freshcart.com",
    });

    await User.create({
      name: "Admin",
      email:
        "admin@freshcart.com",
      password:
        hashedPassword,
      role: "admin",
    });

    console.log(
      "Admin Created"
    );

    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });