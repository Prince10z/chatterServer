const mongoose = require("mongoose");
const msgSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    }, username: {
        type: String,
        required: true,
    },
    userid: {
        type: String,
        required: true,
    }
    , msg: {
        type: String,
        required: String
    }
}, { timestamps: true });
const msgModel = mongoose.model('msgModel', msgSchema);
module.exports = { msgModel };