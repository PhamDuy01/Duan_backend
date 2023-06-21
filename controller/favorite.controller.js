const FavoriteModel = require('../model/favorite.model');
const ProductModel = require('../model/product.model');

exports.getFavoritesByUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const favorites = await FavoriteModel.find({ userId });
        const productIds = favorites.map((f) => f.productId);
        const products = await ProductModel.find({ _id: { $in: productIds } });
        res.status(200).send(products);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

exports.addToFavorites = async (req, res) => {
    const productId = req.params.productId;
    const userId = req.params.userId;
    
    try {
        // Check if the favorite already exists in the database
        const existingFavorite = await FavoriteModel.findOne({ productId, userId });
        
        if (existingFavorite) {
            return res.status(400).send({ message: 'Favorite already exists' });
        }
        
        const favorite = new FavoriteModel({
            productId,
            userId,
        });
        
        const newFavorite = await favorite.save();
        res.status(200).send(newFavorite);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}


exports.removeFavorite = async (req, res) => {
    const productId = req.params.productId;
    const userId = req.params.userId;

    try {
        const result = await FavoriteModel.deleteOne({ productId, userId });

        if (result.deletedCount === 0) {
            return res.status(400).send({ message: 'Favorite does not exist' });
        }

        res.status(200).send({ message: 'Favorite removed successfully' });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}


