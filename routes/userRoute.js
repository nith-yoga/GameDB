const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');
const { getGameImage, getImageFromGiantBomb, getGamePublishers } = require('../routes/libraryRoute');

router.use(express.json());

router.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('favoriteGames').populate('recentlyPlayed');

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('profile', {
            userId: user._id,
            favoriteGames: user.favoriteGames,
            recentlyPlayed: user.recentlyPlayed
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send("An error occurred while fetching the profile.");
    }
});

// ADD to User Collection
router.post('/profile/:userId/add', async (req, res) => {
    const { userId } = req.params;
    const { gameId, collectionType } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const gameData = await axios.get(`https://api.rawg.io/api/games/${gameId}?key=${process.env.RAWGAPI_KEY}`);
        const game = gameData.data;

        if (!game) {
            return res.status(404).send("Game not found");
        }

        const boxArtImageUrl = await getImageFromGiantBomb(game.name);
        const publishers = await getGamePublishers(game.id);

        const gameToAdd = {
            gameId,
            gameName: gameData.name,
            imageUrl: getGameImage(game),
            boxArtImageUrl: boxArtImageUrl,
            publishers: publishers || ["Unknown Publisher"]
        };

        // Add game to the appropriate collection
        const validCollections = ['favoriteGames', 'recentlyPlayed'];
        if (!validCollections.includes(collectionType)) {
            return res.status(400).send("Invalid collection type");
        }

        const isDuplicate = user[collectionType].some(game => game.gameId === gameId);
        if (isDuplicate) {
            return res.status(400).send(`Game is already in ${collectionType}.`);
        }

        user[collectionType].push(gameToAdd);
        await user.save();

        res.status(200).send("Game added successfully");
    } catch (error) {
        console.error("Error adding game to profile:", error);
        res.status(500).send(`An error occurred while adding the game: ${error.message}`);
    }
});

// DELETE from Collection
router.delete('/profile/:userId/remove', async (req, res) => {
    const { userId } = req.params;
    const { gameId, collectionType } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (!['favoriteGames', 'recentlyPlayed'].includes(collectionType)) {
            return res.status(400).send("Invalid collection type");
        }

        user[collectionType] = user[collectionType].filter((game) => game.gameId !== gameId);

        await user.save();
        res.status(200).send("Game removed successfully.");
    } catch (error) {
        console.error("Error removing game from pfoiel:", error);
        res.status(500).send("An error occurred while removing the game.");
    }
});

module.exports = router;