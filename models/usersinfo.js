const mongoose = require('mongoose');
const { Socket } = require('socket.io');
const userinfoSchema = new mongoose.Schema({
    Socketid: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        requried: true,
    },
    Rooms: [
        {
            roomId: {
                type: String,
            }
        }
    ]
}, { timestamps: true });
const userinfoModel = mongoose.model('userinfo', userinfoSchema);
module.exports = { userinfoModel };