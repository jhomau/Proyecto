const express = require('express');
var USER = require('../database/user');
var HOME = require('../database/home');
var NEIGH = require('../database/neigh');
var router = express.Router();
var crypto = require('crypto');
var jwt = require ('jsonwebtoken');
const keycyper = "prueba123";

function verytoken (req,res,next) {
    //Recibimos el token
    const header = req.headers["authorization"];
    if(header == null){
        res.status(300).json({
            "msn" : "no tienen el Permiso"
        });
        return;
    }
    req.token = header;
    jwt.verify(req.token, keycyper, (err,authData)=>{
        if (err) {
            res.status(403).json({
                "msn" : "TOKEN INCORRECTO"
            });
            return;
        }
        var email = authData.usuario;
        USER.find({email:email}).exec((err,docs)=>{
            if (err){
                res.status(300).json({
                    "msn" : "Error en la Base de Datos"
                });
                return;
            };
            if (docs[0].toJSON().rol[0]== "user" || docs[0].toJSON().rol[0]== "admin"){
                next();
            }
            else {
                res.status(300).json({
                    "msn" : "Usted no cuenta con el rol para este servcio"
                });
                return;
            }
        });
        //res.status(200).json(authData);
    });
}
//LOGIN
router.post('/login', async(req,res,next) =>{
    var params = req.body;
    //var passwordcypher = crypto.createHash("md5").update(params.password).digest("hex");
    USER.find({email:params.email,password:params.password}).exec((err,docs)=>{
        if (err){
            res.status(300).json({
                "msn" : "Problemas al adquirir token"
            });
            return;
        }
        if (docs.length == 0){
            console.log(docs,params);
            res.status(300).json({
                "msn" : "Usuario y Password incorrectos"
            });
            return;
        } else{
            //creacion del token
        jwt.sign({usuario: params.email, password: params.password},keycyper,(err,token)=>{
            if (err){
                res.status(300).json({                   
                         "msn" : "Error con JSONWEBTOKEN"
                });
                    return;
                }
                res.status(200).json({
                    "token" : token
                });
            });
        }
    });
});
//INICIO
router.get('/', (req,res,next)=>{
    res.status(200).json({
        "msn"   :   "Exito..!"
    });
});
//POST USUARIO
router.post('/user',verytoken, async(req, res) => {   
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
    //params["password"] = crypto.createHash("md5").update(params.password).digest("hex");
    var users = new USER(params);
    var result = await users.save();
    res.status(200).json(result);  
}); 
//GET USUARIO
router.get("/user",verytoken, (req, res) => {
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
router.patch("/user",verytoken, (req, res) => {
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
router.delete("/user",verytoken, async(req, res) => {
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
router.get("/home",verytoken, (req, res) => {
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
router.post('/home',verytoken, async(req, res) => {   
    var params = req.body;
    var homes = new HOME(params);
    var resultH = await homes.save();
    res.status(200).json(resultH);  
}); 
//GET NEIGH MOSTRAR TODO
router.get("/neigh",verytoken, (req, res) => {
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
router.post('/neigh',verytoken, async(req, res) => {   
    var params = req.body;
    var neighs = new NEIGH(params);
    var resultN = await neighs.save();
    res.status(200).json(resultN);  
}); 

/*GET MOSTRAR HOME POR OPROPERTY(ID,idZona,pk,codigo,idVendedor)
 OCONTACT(lastname,Cpk,movil)*/
router.get("/home/search",verytoken, (req, res) => {
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
router.get("/neigh/search",verytoken, (req, res) => {
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