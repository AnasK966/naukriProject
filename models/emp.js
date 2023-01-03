const mongoose = require("mongoose");
const emp = new mongoose.Schema({
    firstName: {
        required: true,
        type: String,
        min: 4,
        max: 10,
        trim: true
        
    },
    lastName: {
        required: true,
        type: String,
        min: 4,
        max: 10,
        trim: true
        
    },
    email: {
        required: true,
        type: String,
        unique: true,
        trim:true
        
        
    },
    hash_password: {
        type: String,
        required: true,
        trim: true,
        min: 6,
        unique:true
    },
    ph_no: {
        type: String,
        trim: true,
        unique: true,
        required:true
        
    },
    address: {
        country: { type: String },
        city: { type: String }
    },
    postalCode: {
        type: Number,
        trim: true,
    }
    
});

module.exports = mongoose.model("Employee", emp);