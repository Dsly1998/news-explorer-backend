// controllers/usersController.js

const User = require('../models/User'); // Assuming you have a User model

const getLoggedInUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Other user-related controllers can be added here...

module.exports = {
    getLoggedInUser,
    // other exports...
};
