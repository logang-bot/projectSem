const mongoose = require('mongoose');
const menu = require('./menu');
const {Schema} = mongoose

const orden = new Schema({
    idmenu:{ 
        type: Schema.Types.ObjectId,
        ref: "menu"
    },
    idrest:{ 
        type: Schema.Types.ObjectId,
        ref: "restaurant"
    },
    iduser:{ 
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    Cantidad:{type: Number},
    Log:{type: String},
    Lat:{type: String},
    PagoTotal: {type: Number}
})
module.exports = mongoose.model("orden", orden);