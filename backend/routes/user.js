const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
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
 * @route   PUT /api/users/:id/role
 * @desc    Update user role (admin only)
 * @access  Private/Admin
 */
router.put("/:id/role", protect, admin, async (req, res) => {
    try {
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isSuperAdmin) {
            return res
                .status(403)
                .json({ message: "Super Admin role cannot be changed" });
        }

        user.role = role;
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isSuperAdmin: updatedUser.isSuperAdmin,
        });
    } catch (error) {
        console.error("Error updating user role:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user (admin only)
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res
                .status(400)
                .json({ message: "Admins cannot delete their own account" });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Prevent deleting Super Admin
        if (user.isSuperAdmin) {
            return res.status(403).json({ message: "Super Admin cannot be deleted" });
        }

        await user.deleteOne();

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
