const ctrl = {}
const {orden, menu} = require('../models')

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
ctrl.edit = async (req, res) => {
    const id = req.params.id
    console.log(id)
    var {cantidad, log, lat} = req.body;
    if(!cantidad || !log || !lat){
        return res.status(400).send({message: 'No se permite campos vacios'});
    } 
    else {
        const oldorden=await orden.findById(id)
        const menus=await menu.findById(oldorden.idmenu)
        if (parseInt(cantidad) > menus.cantidad_por_dia) {
            return res.status(400).json({ message: 'ya no hay esa cantidad de unidades disponibles ' })
        }
        else{
        var{pagoTotal}=parseFloat(menus.precio) * parseFloat(cantidad)
        await orden.findByIdAndUpdate(id,{cantidad,log,lat,pagoTotal})
        return res.status(200).send({message: 'orden actualizada'});
    }
    }
}
ctrl.ord = async (req, res) => {
    const ordenes = await orden.find({iduser: req.userId})
    console.log(ordenes)
    if (!ordenes)
        return res.status(400).json ({message: "El usuario no realizo ninguna orden"});
    else{
        return res.status(200).json(ordenes)
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