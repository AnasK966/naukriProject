const mongoose = require("mongoose");

const Cv = new mongoose.Schema({
    resume: { type: String },
    candidate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }
});

module.exports = mongoose.model("CV",Cv);

