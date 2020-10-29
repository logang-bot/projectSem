const mongoose = require('mongoose')
const {Schema} = mongoose

const Res = new Schema({
    nombre:{type: String},
    nit:{type: String},
    propietario:{type: String},
    calle:{type: String},
    telefono:{type: String},
    log:{type: String},
    lat:{type: String},
    logo:{type: String, default:""},
    fechaReg:{type: Date,default:Date.now},
    foto:{type: String, default:""}
})
module.exports = mongoose.model("restaurant", Res);