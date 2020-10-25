const jwt = require('jsonwebtoken')
const moment = require('moment')
const config = require('../config/config')

function auth(req,res,next){
    const token = req.headers['x-access-token']
    if(!token){
        console.log("falta un token")
        return res.send({message: "falta un token"})
    }
    try {
        const decod = jwt.verify(token, config.secret)
        if (decod) {
            console.log(moment())
            console.log(decod)
            req.userId = decod.id
            //console.log(req.userId)
            next()
        }
        else return res.send({message: "token invalido"})
    }catch(err){
        return res.send({message: "expiredToken"})
    }
}
module.exports = auth