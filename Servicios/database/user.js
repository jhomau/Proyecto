const mongoose = require('./connect');
var USERSCHEMA = {
    usuario     : String,
    password    : String,
    email       : String,
    address     : String,
    sex         : String,
    registerdate: Date,
    rol         : Array
};
const USER = mongoose.model("user",USERSCHEMA);
module.exports = USER;