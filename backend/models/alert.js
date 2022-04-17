const mongoose = require("mongoose");

const alertSchema = mongoose.Schema({
    user_ID: {
        type: String
    },
    user_email: {
        type: String
    },
    limit: {
        type: Number
    },
    recordedAmount: {
        type :Number
    },
},
{
    timestamps: {createdAt: true, updatedAt: false}
});

const Alert = module.exports = mongoose.model("alert", alertSchema);