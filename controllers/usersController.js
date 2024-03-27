const User = require("../models/User");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

// Controller to register a new user
const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if the user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" }); // Changed status to 409 Conflict
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with hashed password
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    // Save the new user to the database
    await newUser.save();

    // Return success response
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Controller to get user profile
const getUserProfile = async (req, res) => {
  try {
    // Retrieve the logged-in user using the user id attached to the request object
    const user = await User.findById(req.user.id).select("-password");

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user profile
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  registerUser,
  getUserProfile,
};
