const ctrl = {}
const {user} = require('../models')

ctrl.index = async (req,res)=>{
    const users = await user.find({})
    res.status(200).json(users)
}


module.exports = ctrl