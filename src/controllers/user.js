const ctrl = {}
const {user} = require('../models')

ctrl.index = async (req,res)=>{
    const users = await user.find({})
    res.status(200).json(users)
}

ctrl.signUp = (req,res)=> {
    var usuario= new user()
    console.log(req.body)
    var {name,email,password} = req.body 

    if(name){  
        usuario.nombre = name;
        usuario.email = email;
        usuario.password = password;    
        usuario.save((err, usersaved) => {
            if(err) return res.status(500).send({message: 'Error en el servidor'});
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