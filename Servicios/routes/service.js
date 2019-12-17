const express = require('express');
var USER = require('../database/user');
var HOME = require('../database/home');
var NEIGH = require('../database/neigh');
var router = express.Router();
var crypto = require('crypto');
//INICIO
router.get('/', (req,res,next)=>{
    res.status(200).json({
        "msn"   :   "Exito..!"
    });
});
//POST USUARIO
router.post('/user', async(req, res) => {   
    var params = req.body;
    params["registerdate"] = new Date();
    params["rol"] = ["user"];
    if (params.password ==null){
        res.status(300).json({
            "msn" : "No tiene el password"
        });
        return;
    }
    //HASH DE PASSWORD
    params["password"] = crypto.createHash("md5").update(params.password).digest("hex");
    var users = new USER(params);
    var result = await users.save();
    
    res.status(200).json(result);  
}); 
//GET USUARIO
router.get("/user", (req, res) => {
    var params = req.query;
    var limit = 3;
    var filter = {};
    if (params.limit != null) {  
        limit = parseInt(params.limit);
    }
    var order = 1;
    if (params.order != null) {  
        if (params.order == "desc") {    
            order = -1;  
        } else if (params.order == "asc") {    
            order = 1;  
        }
    }
    var skip = 0;
    if (params.skip != null) {  
        skip = parseInt(params.skip);
    }
    if (params.usario != null) {
        filter["usuario"] = params.usuario;
    }
    if (params.email != null) {
        filter["email"] = params.email;
    }
    if (params.password != null) {
        filter["password"] = params.password;
    }
    if (params.id  != null) {
        filter["_id"] = params.id;
    }
    if (params.search != null){
        var regularexpresion = new RegExp(params.search, "g");
        filter["name"] = regularexpresion;
    }
    USER.find(filter).limit(limit).sort({_id: order}).skip(skip).exec((err, docs) => { 
        if(err){
            res.status(300).json({
                "msn":"Error en la Base de Datos."
            });
       }
        res.status(200).json(docs);
    })
});
// PATCH USUARIO
router.patch("/user", (req, res) => {
    if (req.query.id == null) {  
        res.status(300).json({    
            msn: "Error no existe id"  
        });  
        return;
    }
    var id = req.query.id;
    var params = req.body;
    USER.findOneAndUpdate({_id: id}, params, (err, docs) => {  
        res.status(200).json(docs);
    })
}); 
//DELETE USUARIO
router.delete("/user", async(req, res) => {
    if (req.query.id == null) {  
        res.status(300).json({    
            msn: "Error no existe id"  
        }); 
    return;
    }
    var r = await USER.remove({_id: req.query.id});
    res.status(300).json(r);
});

//GET HOME MOSTRAR TODO
router.get("/home", (req, res) => {
    var params = req.query;
    var limit;
    var filter = {};
    if (params.limit != null) {  
        limit = parseInt(params.limit);
    }
    var order = 1;
    if (params.order != null) {  
        if (params.order == "desc") {    
            order = -1;  
        } else if (params.order == "asc") {    
            order = 1;  
        }
    }
    var skip = 0;
    if (params.skip != null) {  
        skip = parseInt(params.skip);
    }    
    HOME.find(filter).limit(limit).sort({_id: order}).skip(skip).exec((err, docs) => { 
        if(err){
            res.status(300).json({
                "msn":"Error en la Base de Datos."
            });
       }
        res.status(200).json(docs);
    })
});
//POST HOME
router.post('/home', async(req, res) => {   
    var params = req.body;
    var homes = new HOME(params);
    var resultH = await homes.save();
    res.status(200).json(resultH);  
}); 
//GET NEIGH MOSTRAR TODO
router.get("/neigh", (req, res) => {
    var params = req.query;
    var limit;
    var order = 1;
    var skip = 0;
    var filter = {};
    if (params.limit != null) {  
        limit = parseInt(params.limit);
    }
    //ORDER USER 
    if (params.order != null) {  
        if (params.order == "desc") {    
            order = -1;  
        } else if (params.order == "asc") {    
            order = 1;  
        }
    }
    if (params.skip != null) {  
        skip = parseInt(params.skip);
    }
    NEIGH.find(filter).limit(limit).sort({_id: order}).skip(skip).exec((err, docs) => { 
        if(err){
            res.status(300).json({
                "msn":"Error en la Base de Datos."
            });
       }
        res.status(200).json(docs);
    })
});
//POST NEIGH
router.post('/neigh', async(req, res) => {   
    var params = req.body;
    var neighs = new NEIGH(params);
    var resultN = await neighs.save();
    res.status(200).json(resultN);  
}); 

/*GET MOSTRAR HOME POR OPROPERTY(ID,idZona,pk,codigo,idVendedor)
 OCONTACT(lastname,Cpk,movil)*/
router.get("/home/search", (req, res) => {
    var params = req.query;
    var limit;
    var filter = {};
    if (params.limit != null) {  
        limit = parseInt(params.limit);
    }
    if (params.idZona != null) {
        filter["idZona"] = params.idZona;
    }
    if (params.ID != null) {
        filter["ID"] = params.ID;
    }
    if (params.pk != null) {
        filter["pk"] = params.pk;
    }
    if (params.codigo != null) {
        filter["codigo"] = params.codigo;
    }
    if (params.idVendedor  != null) {
        filter["idVendedor"] = params.idVendedor;
    }
    if (params.lastname != null) {
        filter["lastname"] = params.lastname;
    }
    if (params.Cpk != null) {
        filter["Cpk"] = params.Cpk;
    }
    if (params.movil != null) {
        filter["movil"] = params.movil;
    }
    if (params.search != null){
        var regularexpresion = new RegExp(params.search, "g");
        filter["name"] = regularexpresion;
    }
    HOME.find(filter).limit(limit).exec((err, docs) => { 
        if(err){
            res.status(300).json({
                "msn":"Error en la Base de Datos."
            });
       }
        res.status(200).json(docs);
    })
});
//GET MOSTRAR NEIGH POR
router.get("/neigh/search", (req, res) => {
    var params = req.query;
    var limit;
    var filter = {};
    if (params.limit != null) {  
        limit = parseInt(params.limit);
    }
    /*id              : String,
    departamento    : String,
    nombre          : String,
    zoom            : Number,
    lat             : Number,
    lng             : Number,
    coordenadas     : Array*/
    if (params.id != null) {
        filter["id"] = params.id;
    }
    if (params.departamento != null) {
        filter["departamento"] = params.departamento;
    }
    if (params.nombre != null) {
        filter["nombre"] = params.nombre;
    }
    if (params.zoom != null) {
        filter["zoom"] = params.zoom;
    }
    if (params.lat != null) {
        filter["lat"] = params.lat;
    }
    if (params.lng != null) {
        filter["lng"] = params.lng;
    }
    if (params.search != null){
        var regularexpresion = new RegExp(params.search, "g");
        filter["name"] = regularexpresion;
    }
    NEIGH.find(filter).limit(limit).exec((err, docs) => { 
        if(err){
            res.status(300).json({
                "msn":"Error en la Base de Datos."
            });
       }
        res.status(200).json(docs);
    })
});
module.exports = router;