// ADMIN LOGIN
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN EMAIL:", email);
    console.log("LOGIN PASSWORD:", password);

    const admin = await User.findOne({
      email: email.trim(),
    });

    console.log("FOUND ADMIN:", admin);

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found",
      });
    }

    const match = await bcrypt.compare(
      password,
      admin.password
    );

    console.log("PASSWORD MATCH:", match);
    console.log("ROLE:", admin.role);

    if (
      match &&
      admin.role === "admin"
    ) {
      return res.json({
        message: "Admin login success",
        token: generateToken(admin._id),
        user: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    }

    res.status(401).json({
      message: "Invalid admin credentials",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};