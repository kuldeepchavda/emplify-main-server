const dbUtils = require("../../config/DatabaseConfig")
const User = dbUtils.getCollection(process.env.USERS_DATABASE);
 
/**
 * Get current user profile (from req.user)
 */
 const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

/**Get all users (admin style)*/
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

/**
 * Update current user
 */
 const updateUser = async (req, res) => {
  try {
    console.log(req.user);            
    const userId = req.user._id;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

/**
 * Delete current user
 */
 const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

module.exports  = {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
}