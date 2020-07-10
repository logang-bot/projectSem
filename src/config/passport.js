const passport = require('passport')
const localStrategy = require('passport-local').Strategy

const {user}= require('../models')
const { estimatedDocumentCount } = require('../models/user')

passport.use(new localStrategy({
    usernameField: 'email'
}, async (email,password, done)=>{
    const userr = await user.findOne({email:email})
    if(!userr){
        console.log('el usuario no existe')
        return done(null, false)
    }
    else{
        const match = await userr.match(password)
        if(match){
            console.log('logueado')
            return done(null,false)
        }
        else{
            console.log('las contrasenias no coinciden')
            return done(null,false)
        }
    }
}))

/*passport.serializeUser((userr,done)=>{
    done(null, userr.id)
})

passport.deserializeUser((id, done)=>{
    user.findById(id,(err,user)=>{
        done(err,user)
    })
})*/
module.exports = passport