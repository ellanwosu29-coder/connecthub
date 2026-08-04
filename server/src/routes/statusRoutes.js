const express = require('express');
const router = express.Router();
const {
    createStatus,
    getFriendsStatuses,
    viewStatus,
    deleteStatus,
    getMyStatuses
} = require('../controllers/statusController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, createStatus);
router.get('/friends', authMiddleware, getFriendsStatuses);
router.get('/mine', authMiddleware, getMyStatuses);
router.put('/view/:statusId', authMiddleware, viewStatus);
router.delete('/:statusId', authMiddleware, deleteStatus);

module.exports = router;