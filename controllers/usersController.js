const User = require("../models/User"); // Assuming you have a User model

// Controller to create a new user
const createUser = async (req, res) => {
  try {
    // Extract user data from request body
    const { email, password, name } = req.body;

    // Check if the user already exists
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user instance
    const newUser = new User({
      email,
      password, // Make sure to hash the password before saving to the database
      name,
      // Add other fields as needed
    });

    // Save the new user to the database
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Controller to get information about the logged-in user
const getLoggedInUser = async (req, res) => {
  try {
    // Retrieve the logged-in user using the user id attached to the request object
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Other user-related controllers can be added here...

module.exports = {
  createUser,
  getLoggedInUser,
  // Add other controller exports here...
};
