const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../config/db');

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

CategorySchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const CategoryModel = db.model('category', CategorySchema)

module.exports = CategoryModel