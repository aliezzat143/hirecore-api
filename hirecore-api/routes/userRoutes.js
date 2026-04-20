const express = require('express');
const authenticateToken = require('../middleware/auth');
const userController = require('../controllers/userControllers');
const multer = require('multer');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/:id/profile-picture', authenticateToken, upload.single('profilePicture'), userController.uploadProfilePicture);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;
