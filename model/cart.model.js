const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../config/db');

const cartItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    }
});

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: [cartItemSchema],
        required: true
    },
    total: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

cartSchema.pre('save', function (next) {
    const total = this.items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    this.total = total.toString();
    next();
});

cartSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const CartModel = db.model('cart', cartSchema)

module.exports = CartModel