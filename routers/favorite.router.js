const express = require('express');
const router = express.Router();
const favoriteController = require('../controller/favorite.controller');

router.get('/user/:userId', favoriteController.getFavoritesByUserId);
router.post('/:productId/user/:userId', favoriteController.addToFavorites);
router.delete('/:id', favoriteController.removeFavorite);

module.exports = router;
