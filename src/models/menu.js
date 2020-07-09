const mongoose = require('mongoose')
const {Schema} = mongoose
//const sc =mongoose.Schema();

const menu = new Schema({
    Nombre:{type: String},
    Precio:{type: Number},
    Descripcion:{type: String},
    Fechareg:{type: String},
    Foto:{type: String, default:""}
})
module.exports = mongoose.model("menu", menu);