const ctrl = {}
const {orden, menu, restaurant} = require('../models')

ctrl.index = async (req,res)=>{
    const ords = await orden.find({iduser: req.idUser, estado: "0"}) 
    res.status(200).json(ords)
}

ctrl.test = async (req,res)=>{
    const {idRes} = req.params
    const menus  = await menu.find({id_rest: idRes}, {nombre: 0, foto:0, contador:0, precio:0, descripcion:0,fechareg:0})
    /*let k = 0
    console.log(menus[k].id)*/
    const orders = []
    let i = 0
    for(i=0; i<menus.length; i++){
        const or = await orden.find({idmenu: menus[i].id})
        if(or.length>0) orders.push(or)
    }
    res.send(orders)
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