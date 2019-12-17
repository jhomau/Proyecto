const mongoose = require('./connect');
var NEIGHSCHEMA = {
    id              : String,
    departamento    : String,
    nombre          : String,
    zoom            : Number,
    lat             : Number,
    lng             : Number,
    coordenadas     : Array
};
const NEIGH = mongoose.model("neighborhood",NEIGHSCHEMA);
module.exports = NEIGH;