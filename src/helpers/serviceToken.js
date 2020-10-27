const jwt = require('jsonwebtoken')
const moment = require('moment')
const config = require('../config/config')
const ctrl = {}

ctrl.createToken =  id => {
    const params = {
        id: id,
        iat: moment().unix(),
        exp: moment().add(1, 'month').unix()
    }
    return jwt.sign(params, config.secret)
}
module.exports = ctrl