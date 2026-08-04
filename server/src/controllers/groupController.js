const Group = require('../models/GroupModel');
const Message = require('../models/MessageModel');

// Create a group
const createGroup = async (req, res) => {
    try {
        const { name, members } = req.body;
        const adminId = req.user.id;

        if (!name || !members || members.length === 0) {
            return res.status(400).json({ message: 'Name and at least one member required' });
        }

        // Always include the creator as a member
        const allMembers = [...new Set([adminId, ...members])];

        const group = await Group.create({
            name,
            admin: adminId,
            members: allMembers
        });

        const populated = await group.populate('members', 'name email avatar online');

        res.status(201).json({ message: 'Group created', group: populated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all groups the logged-in user belongs to
const getMyGroups = async (req, res) => {
    try {
        const userId = req.user.id;

        const groups = await Group.find({ members: userId })
            .populate('members', 'name email avatar online')
            .populate('admin', 'name')
            .sort({ lastMessageTime: -1 });

        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get group messages
const getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;

        // Verify user is a member
        const group = await Group.findById(groupId);
        if (!group || !group.members.includes(userId)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const messages = await Message.find({ groupId })
            .populate('sender', 'name avatar')
            .sort({ createdAt: 1 });

        const formatted = messages.map(msg => ({
            senderId: msg.sender._id.toString(),
            senderName: msg.sender.name,
            text: msg.text,
            time: new Date(msg.createdAt).toLocaleTimeString()
        }));

        res.status(200).json(formatted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a member to a group
const addMember = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { userId } = req.body;
        const adminId = req.user.id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        if (group.admin.toString() !== adminId) {
            return res.status(403).json({ message: 'Only admin can add members' });
        }

        if (group.members.includes(userId)) {
            return res.status(400).json({ message: 'User already in group' });
        }

        group.members.push(userId);
        await group.save();

        res.status(200).json({ message: 'Member added', group });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createGroup, getMyGroups, getGroupMessages, addMember };