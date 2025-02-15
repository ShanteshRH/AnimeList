const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  
const multer = require('multer');
const authenticateUser = require('../middlewares/authenticateUser');
const User = require('../models/User');


const router = express.Router()

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'uploads/');
    },
    filename: (req,file,cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({storage});

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    

    try {
        const existingUser = await User.findOne({ $or: [{email},{username}]});
        if(existingUser) return res.status(400).json({message:'Username or email already exists'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        // console.log(user);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Wrong Credentials" });
            return;
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '6h' });
        res.status(200).json({ token, username: user.username , profilePicture: user.profilePicture || 'http://localhost:5000/uploads/default.jpg'});
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});

router.post('/upload-profile-picture',authenticateUser,upload.single('profilePicture'),async (req,res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        // console.log(user);
        if(!user) return res.status(404).json({error:'User not found'});

        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        user.profilePicture = `http://localhost:5000/uploads/${req.file.filename}`;
        await user.save();

        res.json({profilePicture: user.profilePicture.trim(),});
    } catch (error) {
        res.status(500).json({ message: 'Error uploading profile picture' });
    }
});

router.get('/profile', authenticateUser,async(req,res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        console.log(user);
        res.json({
            username: user.username,
            profilePicture: user.profilePicture.trim(),
        })

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.delete('/delete-profile-picture',authenticateUser, async (req,res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message:'User not found'});
        user.profilePicture='http://localhost:5000/uploads/default.jpg';
        await user.save();
        res.status(200).json({message:'Profile picture deleted successfully'});
    } catch (error) {
        console.error('Error deleting profile picture:', error);
        res.status(500).json({ message: 'Error deleting profile picture' });
    }
})

router.put('/update-username',authenticateUser, async (req,res) => {
    const userId = req.user.id;
    try {
        // console.log(req.body);
        const {username} = req.body;
        if (!username || username.trim().length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
          }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {username: username},
            {new: true}
        );

        if(!updatedUser) return res.status(404).json({message:'User not found'});
        
        res.status(200).json({ message: 'Username updated successfully.', username: updatedUser.username });
    } catch (error) {
        console.error('Error updating username:', error);
    res.status(500).json({ error: 'An error occurred while updating the username.' });
    }
});

module.exports = router;
