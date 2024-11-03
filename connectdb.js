const mongoose = require("mongoose");
function connectDB(url) {
    mongoose.connect(url);
    mongoose.connection.on('connected', () => console.log('connected to database'));
    mongoose.connection.on('error', () => console.log("Error in connecting database"));
    mongoose.connection.on('close', () => console.log('close'));
}
module.exports = {
    connectDB
}