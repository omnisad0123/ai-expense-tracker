const express = require("express");
// Import the full controller instead of just register/login
const authController = require("../controllers/authController"); 
// Import your JWT middleware
const authMiddleware = require("../middlewares/authMiddleware"); 

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

// Now these have access to the imported middleware and controller
router.delete("/delete-account", authMiddleware, authController.deleteAccount);
router.put("/update-profile", authMiddleware, authController.updateProfile);

module.exports = router;