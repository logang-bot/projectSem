const ctrl = {}
const {user} = require('../models')
const passport = require('passport')

ctrl.index = async (req,res)=>{
    const users = await user.find({})
    res.status(200).json(users)
}

ctrl.logIn = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/',
})

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
                return res.status(200).send({
                usuario: usersaved
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


module.exports = ctrl