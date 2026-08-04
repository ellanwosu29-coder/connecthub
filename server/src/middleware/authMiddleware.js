const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const authMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach full user (without password)
            req.user = await UserModel.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }

            next();
        } catch (error) {
            console.error("Auth Error:", error.message);
            res.status(401).json({ message: "Unauthorized access" });
        }
    } else {
        res.status(401).json({ message: "Unauthorized access" });
    }
};

module.exports = { authMiddleware };