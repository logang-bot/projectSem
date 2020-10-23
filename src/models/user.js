const mongoose = require('mongoose')
const {Schema} = mongoose
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    name:{type: String, required: true},
    email:{type: String, required: true},
    password:{type: String, required:true},
    avatar:{type: String},
    date:{type:Date, default: Date.now},
    namefac:{type: String},
    cifac:{type: String}
})

userSchema.methods.encrypt = async (password)=>{
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(password, salt)
    return hash
}

userSchema.methods.match = async function(password){
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('user', userSchema)