const mongoose = require("mongoose");
const posts = new mongoose.Schema({
    title: {
        type: String,
        required:true,
    },
    jobtype: {
        type:String
    },
    jobDesc: {
        type:String
    },
    qualReq: {
        degree: { type: String }
    },
    skillReq: [{
        name:{ type: String }
    }],
    salRange: {
        maxSal: {type:String},
        minSal:{type:String}
    },
    expReq: {
        type:Number
    },
    candidateCount: {
        type: Number,
        default:0
    },
    jobStatus: {
        type: Boolean,
        default:true  
    },
    createdBy: {    
        type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true
    },
    candidate_id:[ {
        ids: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
    }],
    
}, { timestamps: true });


module.exports=mongoose.model("Posts",posts)