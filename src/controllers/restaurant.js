const ctrl = {}
const {user, restaurant} = require('../models')

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