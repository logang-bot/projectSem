const ctrl = {}
const {restaurant,user} = require('../models')
const config = require('../config/config')

ctrl.index = async (req,res)=>{
    const rests = await restaurant.find({})
    res.send(rests)
}

ctrl.create = async (req,res)=> {
    var newresta= new restaurant
    var {nombre,nit,calle,telefono,log,lat} = req.body 

    if(nombre && nit && calle && telefono && log && lat){  
        const bnombre= await restaurant.findOne({nombre: nombre}) //consulta a la DB
        const bnit= await restaurant.findOne({nit:nit})
        if (bnombre)
           return res.status(400).json({message: "el nombre ya esta en uso, ingrese otro diferente"})
        if (bnit)
           return res.status(400).json({message: "el nit ya esta en uso, ingrese otro diferente"})
        newresta.nombre = nombre;
        newresta.nit = nit;
        newresta.propietario = req.userId; //id del usuario
        newresta.calle= calle;
        newresta.telefono= telefono;
        newresta.log=log;
        newresta.lat=lat;
        await newresta.save((err, restsaved) => {
            if(err) 
                return res.status(500).send({message: `Error en el servidor ${err}`});
            if(restsaved){
                return res.status(200).send({
                    message: 'El restaurant fue creado correctamente',
                    result: restsaved
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
        console.log(rest.propietario)
        console.log(newuser.id)
        if(rest.propietario == req.userId){
            await restaurant.findByIdAndUpdate(id, {propietario: newuser._id.toString()})
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