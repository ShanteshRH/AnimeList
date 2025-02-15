const mongoose = require('mongoose')

const AnimeListSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    animeId: {type:String, required:true},
    title: {type:String, required:true},
    image: { type: String, required: true },
    status: {type:String, enum: ['Watching','Completed','Plan to watch']},
    score: {type:Number, min:1, max:10},
    addedAt: {type:Date, default: Date.now},
});

AnimeListSchema.index({ userId: 1, animeId: 1 }, { unique: true });

module.exports = mongoose.model('AnimeList',AnimeListSchema);