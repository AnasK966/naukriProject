const mongoose = require("mongoose");
const review = mongoose.Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    review:[ {
        comment: { type: String, required: true },
        rating:{type:Number}
    }]
})

module.exports = mongoose.model("Review", review)
