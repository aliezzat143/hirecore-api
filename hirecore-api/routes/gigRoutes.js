const express = require('express');
const authenticateToken = require('../middleware/auth');
const gigController = require('../controllers/gigController');
const multer = require('multer');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticateToken, upload.array('images', 5), gigController.createGig);
router.get('/', gigController.getGigs);
router.get('/:id', gigController.getGigById);
router.put('/:id', authenticateToken, upload.array('images', 5), gigController.updateGig);
router.delete('/:id', authenticateToken, gigController.deleteGig);

module.exports = router;