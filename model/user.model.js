const mongoose = require('mongoose');
const db = require('../config/db');

const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    email:{
        type: String,
        lowercase: true,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    }
});

userSchema.pre('save', async function(){
    try {
        var user = this;
        var salt = await(bcrypt.genSalt(10));
        const hashpass = await bcrypt.hash(user.password, salt);

        user.password = hashpass;
    } catch (error) {
        throw error;
    }
})

userSchema.methods.comparePassword = async function (userPassword) {
    try {
        console.log('----------------no password',this.password);
        // @ts-ignore
        const isMatch = await bcrypt.compare(userPassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};


const UserModel = db.model('user', userSchema);

module.exports = UserModel;