const ctrl = {}
const {orden, menu} = require('../models')
const { findById } = require('../models/user')

ctrl.index = async (req,res)=>{
    const ords = await orden.find({iduser: req.idUser, estado: "0"}) 
    res.status(200).json(ords)
}

ctrl.cart = async (req, res) => {
    const idUser = req.idUser
    const neworden = new orden(req.body)
    const errors = []
    if (!neworden.cantidad || neworden.cantidad <= 0) errors.push({ error: "la cantidad debe ser mayor a cero" })
    if (!neworden.log) errors.push({ error: "la ubicacion es necesaria" })
    if (!neworden.lat) errors.push({ error: "la ubicacion es necesaria" })
    if (errors.length > 0) return res.status(400).json(errors)
    else {
        const { idMenu } = req.params
        const men = await menu.findById(idMenu)
        if (parseInt(neworden.cantidad) > men.cantidad_por_dia) {
            return res.status(400).json({ message: 'ya no hay unidades disponibles por favor revise la cantidad de unidades existentes' })
        }
        else {
            neworden.idmenu = men.id
            const total = parseFloat(men.precio) * parseFloat(neworden.cantidad)
            neworden.pagoTotal = total
            neworden.iduser = idUser
            men.cantidad_por_dia -= neworden.cantidad
            await neworden.save()
            await men.save()
            res.send('agregado al carrito correctamente')
        }
    }
}

ctrl.delete = async (req,res)=>{
    const idOrden = req.params.id
    const deleteOrden= await orden.findByIdAndDelete(idOrden)
    if(!deleteOrden)
        return res.status(400).json({message: "el pedido que intenta eliminar no existe en el carrito"})
    res.status(400).json({message: "la eliminacion ha sido exitosa exitosa"})
}
ctrl.create = async (req,res)=>{
    const idOrden= req.params.id
    const findOrden = await findById(idOrden)
    if(!findOrden)
        return res.status(400).json({message: "el pedido no existe"})
    else{
        const ChangeOrden = await orden.findByIdAndUpdate(idOrden, {estado: 1})
        if (!ChangeOrden)
            return res.status(500).json({message: "ha ocurrido un error en el servidor"})
        else 
            res.send(findOrden)
            res.status(200).json({message: "su pedido ha sido enviado correctamente"})
    }
}  
ctrl.wait = async (req,res)=>{
    const ords = await orden.find({iduser: req.userId, estado: 2})
    res.status(200).json(ords)
}

ctrl.confrec = async(req,res)=>{
    const {id} = req.params
    await orden.findByIdAndUpdate(id, {estado: 4})
    res.status(200).send('acaba de confirmar la orden')
}

ctrl.owtosend = async(req,res)=>{
    const {id} = req.params
    await orden.findByIdAndUpdate(id, {estado: 3})
}
module.exports = ctrl