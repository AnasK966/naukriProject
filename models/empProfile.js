const mongoose = require("mongoose");
const profile = new mongoose.Schema({
    candidate_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true,unique:true
    },
    education: { type: String },
    skills: [
        { type: String } 
    ],
    certificates: [
        { type: String }
    ]
    
})

module.exports=mongoose.model("Profile",profile)