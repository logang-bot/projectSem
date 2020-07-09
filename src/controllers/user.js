const ctrl = {}
const {user} = require('../models')
const passport = require('passport')

ctrl.index = async (req,res)=>{
    const users = await user.find({})
    res.status(200).json(users)
}

ctrl.logIn = passport.authenticate('local',{
    successRedirect: '/res',
    failureRedirect: '/',
})

module.exports = ctrl