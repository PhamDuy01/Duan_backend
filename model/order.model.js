const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../config/db');

const orderItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    tempValue: {
        type: String,
        required: false
    }
});

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: [orderItemSchema],
        required: true
    },
    total: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    customerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    deliveryCharges: {
        type: String,
        default: "20000",
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

orderSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const OrderModel = db.model('order', orderSchema)

module.exports = OrderModel