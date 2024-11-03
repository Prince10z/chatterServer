const { userinfoModel } = require('../models/usersinfo.js');
async function checkusernameExist(username) {
    try {
        const user = await userinfoModel.findOne({
            username: username
        });
        if (user) {
            return true;
        } else {
            return false;
        }
    }
    catch (err) {
        return null;
    }
}
async function createuserOrAddToRoom(roomId, socketId, username) {
    try {
        roomId = roomId.toString();
        const user = await userinfoModel.findOne({
            Socketid: socketId
        });
        if (!user) {
            const newuser = await userinfoModel.create({
                Socketid: socketId,
                username: username,
                Rooms: []

            })
            newuser.Rooms.push({ roomId: roomId });
            return {
                status: "success",
                msg: {
                    username: username,
                    roomId: roomId,
                }
            }
        } else {
            if (user.Rooms.includes({ roomId })) {
                return {
                    status: "failed",
                    msg: "User already exist"
                };
            } else {
                user.Rooms.push({ roomId: roomId });
                return {
                    status: "success",
                    msg: {
                        username: username,
                        roomId: roomId,
                    }
                }

            }
        }
    } catch (err) {
        return {
            status: "failed",
            msg: {
                error: err,
            }
        }
    }

}
module.exports = {
    createuserOrAddToRoom,
    checkusernameExist
}