const ctrl ={}
const{user, restaurant}=require('../models')

ctrl.index = async (req,res)=>{
     const resta =await restaurant.find({propietario: req.userId})
         if(resta)
             return res.status(200).json(rest)
         else
             return es.status(400).json({message: "El usuario no tiene restaurantes"})
     } 
         
 ctrl.delete = async (req,res)=>{
     const id= req.params.id
     await restaurant.findByIdAndDelete(id)
     res.send('El restaurant fue eliminado exitosamente')
     }
