const mongoose = require('mongoose')
const {Schema} = mongoose
//const sc =mongoose.Schema();

const menu = new Schema({
    nombre:{type: String},
    precio:{type: Number},
    descripcion:{type: String},
    fechareg:{type: Date , default: Date.now},
    foto:{type: String, default:""},
    resta: {type: String},
    imgresta:{type: String},
    id_rest :{ 
        type: Schema.Types.ObjectId,
        ref : 'restaurant'
    },
    contador: {type: Number, default:0},
    cantidad_por_dia: {type: Number, required: true}
})
module.exports = mongoose.model("menu", menu);