const User = require("../models/User");
const jwt = require('jsonwebtoken')

const authenticateUser = async (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) return res.status(401).json({message:"Unauthorized"});
    
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId);
        next();
    } catch (error) {
        return res.status(401).json({message:"Invalid"});
    }
}

module.exports = authenticateUser;