const express = require('express');
const router = express.Router();
const favoriteController = require('../controller/favorite.controller');

router.get('/user/:userId', favoriteController.getFavoritesByUserId);
router.post('/add/:productId/:userId', favoriteController.addToFavorites);
router.delete('/remove/:productId/:userId', favoriteController.removeFavorite);
module.exports = router;
