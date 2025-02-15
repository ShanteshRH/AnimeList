const express = require('express');
const AnimeList = require('../models/AnimeList');
const authenticateUser = require('../middlewares/authenticateUser');
const User = require('../models/User');

const router = express.Router();

router.post('/anime-list',authenticateUser,async (req,res) => {
    const {animeId, title, image, status, score} = req.body;
    const userId = req.user.id;

    try {
        const existingAnime = await AnimeList.findOne({userId,animeId});
        if(existingAnime) return res.status(400).json({message:"Anime already in your list"});

        const newAnime = new AnimeList({
            userId,
            animeId,
            title,
            image,
            status: status || 'Plan to watch',
            score: score || null,
        })

        await newAnime.save();
        res.status(201).json({message:"Anime added to your list",anime:newAnime});
    } catch (error) {
        console.error('Error adding anime to list:',error);
        res.status(500).json({message:"Internal server error"});
    }
});

router.put('/anime-list',authenticateUser,async (req,res) => {
    const userId = req.user.id;
    const { animeId, status, score } = req.body;  

    try {
        const updatedAnime = await AnimeList.findOneAndUpdate(
            {userId,animeId},
            {status,score},
            {new:true}
        );

        if (!updatedAnime) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        res.status(200).json({success:true,data:updatedAnime});
    } catch (error) {
        console.error('Error updating anime list:',error);
        res.status(500).json({message:"Internal server error"});
    }
});

router.delete('/anime-list',authenticateUser,async (req,res) => {
    const userId = req.user.id;
    const {animeId} = req.body

    try {
        const deletedAnime = await AnimeList.findOneAndDelete({userId,animeId},);

        if (!deletedAnime) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        res.status(200).json({success:true,message:'Anime Deleted'});
    } catch (error) {
        console.error('Error deleting anime :',error);
        res.status(500).json({message:"Internal server error"});
    }
});


router.get('/anime-list',authenticateUser,async (req,res) => {
    const userId = req.user.id;
    try {
        const anime = await AnimeList.find({userId});
        return res.status(200).json({success:true,data:anime});
    } catch (error) {
        console.log("Error in fetching products");
        return res.status(500).json({success: false, message:'Server Error'});
    }
})

router.get('/profile',authenticateUser,async (req,res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error:'User not found'});
        }

        const animeList = await AnimeList.find({userId});
        
        // console.log(user);
        const animeCount = animeList.length;
        const scoreDistribution = Array(10).fill(0);
        let totalScore = 0;
        let validAnimeCount = 0;

        animeList.forEach(anime => {
            const score = anime.score;

            if(score!=null){
                scoreDistribution[score -1 ] +=1;
                totalScore += score;
                validAnimeCount++;
            }
        });

        const averageScore = validAnimeCount > 0? (totalScore / validAnimeCount).toFixed(2):0;

        res.json({
            username: user.username,
            profilePicture: user.profilePicture || 'luffy.jpeg',
            animeCount,
            validAnimeCount,
            scoreDistribution,
            averageScore
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching profile data' });
    }
})

module.exports = router;