const ctrl = {}
const {orden, menu} = require('../models')

ctrl.index = (req,res)=>{

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
        const { id } = req.params
        const men = await menu.findById(id)
        if (parseInt(neworden.cantidad) > men.cantidad_por_dia) {
            return res.status(400).json({ message: 'ya no hay unidades disponibles por favor revise la cantidad de unidades existentes' })
        }
        else {
            neworden.idmenu = men.id
            const total = parseFloat(men.precio) * parseFloat(neworden.cantidad)
            neworden.pagoTotal = total
            neworden.iduser = idUser
            await neworden.save()
            res.send('agregado al carrito correctamente')
        }
    }
}
ctrl.edit = async (req, res) => {
    const id = req.params.id
    var {idmenu, cantidad, log, lat} = req.body;
    if(!idmenu || !cantidad || !log || !lat){
        return res.status(400).send({message: 'No se permite campos vacios'});
    }else {
        const oldmenu=await menu.findById(id)
        var{pagoTotal}=parseFloat(oldmenu.precio) * parseFloat(cantidad)
        await menu.findByIdAndUpdate(id,{idmenu, cantidad,log,lat,pagoTotal})
        return res.status(200).send({message: 'orden actualizada'});
    }
}
ctrl.ord = async (req, res) => {
    const ordenes = await orden.find({ iduser: req.userId})
    console.log(ordenes)
    if (!ordenes)
        return res.status(400).json ({message: "El usuario no realizo ninguna orden"});
    else{
        return res.status(200).json(ordenes)
    }
}

module.exports = ctrl