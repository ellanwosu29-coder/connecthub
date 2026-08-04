const Message = require('../models/MessageModel');

const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { friendId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: friendId },
                { sender: friendId, receiver: userId }
            ]
        }).sort({ createdAt: 1 });

        const formatted = messages.map(msg => ({
            senderId: msg.sender.toString(),
            text: msg.text,
            time: new Date(msg.createdAt).toLocaleTimeString(),
            read: msg.read,
            delivered: msg.delivered
        }));

        res.status(200).json(formatted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMessages };