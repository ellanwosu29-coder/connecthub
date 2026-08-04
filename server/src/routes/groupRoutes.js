const express = require('express');
const router = express.Router();
const { createGroup, getMyGroups, getGroupMessages, addMember } = require('../controllers/groupController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, createGroup);
router.get('/my-groups', authMiddleware, getMyGroups);
router.get('/:groupId/messages', authMiddleware, getGroupMessages);
router.put('/:groupId/add-member', authMiddleware, addMember);

module.exports = router;