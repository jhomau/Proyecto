const mongoose = require('mongoose');
const databasename = "usuario";
mongoose.connect("mongodb://172.21.0.2:27017/App");
module.exports = mongoose;