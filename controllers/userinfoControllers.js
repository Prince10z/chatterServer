const { checkusernameExist } = require("../repos/usersinfoRepos.js");
async function checkusername(req, res) {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ status: "failed", msg: "username is required" });
    } else if (username.toString().trim().length < 3) {
        return res.status(400).json({ status: "failed", msg: "username minimum length of 3 is required" });
    } else {
        const existuser = await checkusernameExist(username);
        if (existuser === null) {
            return res.status(500).json({ status: "failed", msg: "Server Connectivity error" });
        } else {
            if (existuser == true) {
                return res.status(400).json({ status: "failed", msg: "User already exist please try another username" });
            } else {
                return res.status(200).json({ status: "success", msg: "You can use this name" });
            }
        }
    }
}
module.exports = {
    checkusername
}