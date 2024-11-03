const { msgModel } = require("../models/msgModel.js");
async function createmsg(groupname, username, userid, msg) {
    try {
        const newmsg = await msgModel.create({
            roomId: groupname,
            username: username,
            msg: msg,
            userid: userid

        });
        return newmsg;
    } catch (err) {
        throw new Error(err);
    }
}
module.exports = {
    createmsg
};