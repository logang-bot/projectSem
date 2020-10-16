const {Schema}= require('mongoose')
const mongoose = require('mongoose')
const path  = require('path')

const imgSchema= new Schema({
    filename: {type:String},
    timestamp: {type: Date, default: Date.now}
})

imgSchema.virtual('uniqueId')
.get(function(){
    return this.filename.replace(path.extname(this.filename), '')
})

module.exports = mongoose.model('image', imgSchema)