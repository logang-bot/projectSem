const mongoose = require('mongoose');
const menu = require('./menu');
const {Schema} = mongoose

const orden = new Schema({
    idmenu:{ 
        type: Schema.Types.ObjectId,
        ref: "menu"
    },
    iduser:{ 
        type: Schema.Types.ObjectId,
        ref: "user"
    },

    cantidad:{type: Number},
    log:{type: String},
    lat:{type: String},
    pagoTotal: {type: Number},
    estado:{type: String , default: "0"}
})
module.exports = mongoose.model("orden", orden);