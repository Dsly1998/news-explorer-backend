const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ConflictError = require("../middlewares/errors/ConflictError");
const NotFoundError = require("../middlewares/errors/NotFoundError");
const UnauthorizedError = require("../middlewares/errors/UnauthorizedError");
const ServerError = require("../middlewares/errors/ServerError");

const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    next(new ServerError("Error registering user"));
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.json(user);
  } catch (err) {
    next(new ServerError("Error fetching user profile"));
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new UnauthorizedError("Email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Email or password is incorrect");
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          console.error("Error signing token:", err.message);
          throw new ServerError("Error signing token");
        }
        res.json({
          token,
          user: { id: user.id, name: user.name, email: user.email },
        });
      }
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, getUserProfile, loginUser };
