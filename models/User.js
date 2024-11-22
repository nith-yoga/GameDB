const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favoriteGames: [
        {
            gameId: { type: String, required: true },
            gameName: { type: String },
            boxArtUrl: { type: String },
        }
    ],
    recentlyPlayed: [
        {
            gameId: { type: String, required: true },
            gameName: { type: String },
            boxArtUrl: { type: String },
        }
    ]
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.isValidPasword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema, "Users");

module.exports = User;