const ctrl = {}
const {restaurant,user} = require('../models')
const config = require('../config/config')


ctrl.create = async (req,res)=> {
    var newresta= new restaurant
    var {nombre,nit,propietario,calle,telefono,log,lat} = req.body 

    if(nombre && nit && propietario && calle && telefono && log && lat){  
        const bnombre= await restaurant.findOne({Nombre: nombre}) //consulta a la DB
        const bnit= await restaurant.findOne({Nit:nit})
        if (bnombre)
           return res.status(400).json({message: "el nombre ya esta en uso, ingrese otro diferente"})
        if (bnit)
           return res.status(400).json({message: "el nit ya esta en uso, ingrese otro diferente"})
        newresta.Nombre = nombre;
        newresta.Nit = nit;
        newresta.propietario = nit;
        usuario.password = await usuario.encrypt(password); 
        console.log(usuario)
        await usuario.save((err, usersaved) => {
            if(err) return res.status(500).send({message: `Error en el servidor ${err}`});
            if(usersaved){
                const token = jwt.sign({id: usersaved._id}, config.secret,{
                    expiresIn: 60 * 60 * 24
                })
                const decod = jwt.verify(token, config.secret)
                req.userId = decod.id

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
            message: 'uno o mas campos estan vacios'
        });
    }
}


ctrl.change = async (req,res)=>{
    const {id} = req.params
    const email  = req.body.email
    const olduser  = await user.findById(req.userId)
    const newuser  = await user.findOne({email: email})
    const rest = await restaurant.findById(id)
    if(newuser){
        if(rest.Propietario == newuser.id){
            await restaurant.findByIdAndUpdate(id, {Propietario: newuser._id.toString()})
            await olduser.restaurant.remove(rest)
            await olduser.save()
            newuser.restaurant.push(rest)
            await newuser.save()
            res.send('cambio de propietario exitoso')
        }
        else{
            res.send('no eres el actual propietario de este restaurant')
        }
    }
    else{
        res.send('el usuario no esta registrado')
    }
}

module.exports = ctrl