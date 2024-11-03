const express = require("express");
const route = express();
const { checkusername } = require("../controllers/userinfoControllers");
route.get('/chitchatScreen', (req, res) => {
    return res.render('chatapp');
})
route.post('/api/checkuser', checkusername);
module.exports = {
    route
};