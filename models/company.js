const mongoose = require("mongoose");
const company = new mongoose.Schema({
    name: {
        unique: true,
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    hash_password: {
        unique: true,
        required: true,
        type: String
    },
    ph_no: {
        type: String,
        unique: true,
        required: true
    
    },
    address: {
        country: { type: String },
        city: { type: String }
    }

});
module.exports = mongoose.model("Comapny", company);