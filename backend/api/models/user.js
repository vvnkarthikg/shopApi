const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const addressSchema = mongoose.Schema({
    doorNo: {
        type: String,
        required: true,
        trim: true
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
    landmark: {
        type: String,
        trim: true
    },
    area: {
        type: String,
        required: true,
        trim: true
    },
    mandal: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    }
});

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        match: /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userId: {
        type: Number,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    phoneNumber:{
        type:String,
        trim:true // Optional, but good practice to trim whitespace
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the creation date
    },
    updatedAt: {
        type: Date,
        default: Date.now // Automatically set the update date
    },
    profilepic:{
        type:String,
        default:''
    },
    storeName:{
        type:String,
        required:true, // Assuming store name is mandatory
        trim:true
    },
    gstNumber:{
        type:String,
        required:true, // Assuming GST number is mandatory
        trim:true
    },
    address:{
        type: addressSchema, // Embed the address schema here
        required:true // Assuming address is mandatory
    }
});

// Update updatedAt field on every update
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

userSchema.plugin(AutoIncrement, { inc_field : 'userId' });

module.exports = mongoose.model('User', userSchema);