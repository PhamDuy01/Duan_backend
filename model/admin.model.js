const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../config/db');

const AdministratorSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    refreshToken: [String],
})

AdministratorSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const AdminModel = db.model('administrator', AdministratorSchema)

module.exports = AdminModel