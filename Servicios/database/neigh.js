const mongoose = require('./connect');
var NEIGHSCHEMA = {
    id              : Number,
    departamento    : String,
    nombre          : String,
    zoom            : Number,
    lat             : Number,
    lng             : Number,
    coordenadas     : [{lat:String,
                        lng:String}]
};
const NEIGH = mongoose.model("neighborhood",NEIGHSCHEMA);
module.exports = NEIGH;