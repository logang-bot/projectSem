const jwt = require('jsonwebtoken')
const moment = require('moment')
const config = require('../config/config')

function auth(req,res,next){
    const token = req.headers['x-access-token']
    if(!token){
        return res.status(401).json({message: "falta un token"})
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
        else return res.send('token invalido')
    }catch(err){
        return res.send(`el token ha expirado ${err.name}`)
    }
}
module.exports = auth