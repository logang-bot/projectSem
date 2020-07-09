const ctrl = {}
const {user} = require('../models')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

ctrl.index = async (req,res)=>{
    const users = await user.find({})
    res.status(200).json(users)
}
ctrl.signUp = async (req,res)=> {
    var usuario= new user
    //console.log(req.body)
    var {name,email,password} = req.body 

    if(name){  
        usuario.name = name;
        usuario.email = email;
        usuario.password = await usuario.encrypt(password);    
        console.log(usuario)
        await usuario.save((err, usersaved) => {
            if(err) return res.status(500).send({message: `Error en el servidor ${err}`});
            if(usersaved){
                const token = jwt.sign({id: usersaved._id}, config.secret,{
                    expiresIn: 60 * 60 * 60
                })
                return res.status(200).send({
                usuario: usersaved,
                token: token 
            });
            
            }else{
                return res.status(500).send({
                    message: 'No se ha guardado el usuario'
                });
            } 
        });
    }else{
        return res.status(400).send({
            message: 'El nombre es requerido'
        });
    }
}
ctrl.login = async (req,res)=>{
    const {email, password} = req.body
    const userr = await user.findOne({email:email})
    if (!user) return res.send('el usuario no esta registrado')
    const pass = userr.match(password)
    if(!pass) return res.send('la contrasenia es incorrecta')
    const token = jwt.sign({id: userr._id}, config.secret,{
        expiresIn: 60 * 60 * 60
    })
    res.send({
        message: "estas logueado",
        token: token
    })
}

/*ctrl.logIn = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/',
})
*/

module.exports = ctrl