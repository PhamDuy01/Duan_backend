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
    title: {
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
        required: false
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

orderItemSchema.pre('save', function (next) {
    this.tempValue = (parseFloat(this.price) * this.quantity);
    next();
});

orderSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

orderSchema.pre('save', function (next) {
    const totalItems = this.items.reduce((acc, item) => acc + parseFloat(item.tempValue), 0);
    const total = (totalItems + parseFloat(this.deliveryCharges)).toFixed(2);
    this.total = total - 20000;
    next();
});

const OrderModel = db.model('order', orderSchema)

module.exports = OrderModel