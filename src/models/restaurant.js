const mongoose = require('mongoose')
const {Schema} = mongoose

const Res = new Schema({
    Nombre:{type: String},
    Nit:{type: String},
    Propietario:{type: String},
    Calle:{type: String},
    Telefono:{type: String},
    Log:{type: String},
    Lat:{type: String},
    Logo:{type: String, default:""},
    FechaReg:{type: Date,default:Date.now},
    Foto:{type: String, default:""}
})
module.exports = mongoose.model("restaurant", Res);