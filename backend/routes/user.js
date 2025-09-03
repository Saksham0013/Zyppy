const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();
/**
 * @route   
 * @desc    
 * @access  
 */
router.get("/", protect, admin, async (req, res) => {
    try {
        const users = await User.find().select("-password"); 
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route  
 * @desc    
 * @access  
 */

router.put("/:id/role", protect, admin, async (req, res) => {
    try {
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error updating user role:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   
 * @desc    
 * @access
 */
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res
                .status(400)
                .json({ message: "Admins cannot delete their own account" });
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
