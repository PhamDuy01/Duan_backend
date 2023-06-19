const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../config/db');

const favoriteSchema = new Schema({
    productId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
})

favoriteSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const FavoriteModel = db.model('favorite', favoriteSchema)

module.exports = FavoriteModel