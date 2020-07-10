const jwt = require('jsonwebtoken')
const config = require('../config/config')

function auth(req,res,next){
    const token = req.headers['x-access-token']
    if(!token){
        return res.status(401).json({message: "no se proveyo un token"})
    }
    const decod = jwt.verify(token, config.secret)
    req.userId = decod.id
    next()
}
module.exports = auth