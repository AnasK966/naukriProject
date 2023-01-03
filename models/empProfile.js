const mongoose = require("mongoose");
const profile = new mongoose.Schema({
    candidate_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true,unique:true
    },
    education: { type: String },
    skills: [
        { name: { type: String } }
    ],
    workExp: [{
        companyName: { type: String },
        exp: { type: Number },
        designation: { type: String }
    }],
    certificates: [{
        name:{type:String}
    }],
    resume: {
        type:String
    }
})

module.exports=mongoose.model("Profile",profile)