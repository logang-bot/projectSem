const ctrl = {}

const { findById } = require('../models/user')
const { orden, menu, restaurant } = require('../models')

ctrl.index = async (req, res) => {
    const ords = await orden.find({ iduser: req.userId, estado: "0" })
    const menus  = []
    for(let i=0; i< ords.length; i++){
        const me = await menu.find({_id: ords[i].idmenu})
        if(me.length>0){
            for(let j=0;j<me.length;j++){
                var pos = menus.map(function(e) { 
                    return e.id; 
                }).indexOf(me[j].id);
                if(pos==-1)
                    menus.push(me[j])
            }
        }
    }
    if (menus.length > 0) {
        const rests = []
        for (let i = 0; i < menus.length; i++) {
            const aux = await restaurant.findOne({_id: menus[i].id_rest})
            const testo = rests.includes({menu: menus[i].id, rest: aux.id})
            if(!testo) rests.push({menu: menus[i].id, rest: aux.id})
        }
        console.log(rests)
        const cartords = []
        var flag = rests[0].rest
        var temp = []
        for (let i = 0; i < rests.length; i++) {
            if (flag == rests[i].rest) {
                const aux2 = await orden.find({idmenu: rests[i].menu})
                for (let j = 0; j < aux2.length; j++) {
                    temp.push(aux2[j])
                }
            }
            else{
                cartords.push(temp)
                temp = []
                flag = rests[i].rest
                i--
            }
        }
        cartords.push(temp)
        res.send(cartords)
    }
    else {
        res.status(200).json({ message: 'carrito vacio', data: menus })
    }
}

ctrl.owres = async (req, res) => {
    const { idRes } = req.params
    const menus = await menu.find({ id_rest: idRes }, { nombre: 0, foto: 0, contador: 0, precio: 0, descripcion: 0, fechareg: 0 })
    /*let k = 0
    console.log(menus[k].id)*/
    const orders = []
    let i = 0
    for (i = 0; i < menus.length; i++) {
        const or = await orden.find({ idmenu: menus[i].id })
        if (or.length > 0) orders.push(or)
    }
    res.send(orders)
}

ctrl.cart = async (req, res) => {
    const idUser = req.userId
    console.log(req.idUser)
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
            console.log(neworden.iduser + " " + idUser)
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
    var { cantidad, log, lat } = req.body;
    if (!cantidad || !log || !lat) {
        return res.status(400).send({ message: 'No se permite campos vacios' });
    }
    else {
        const oldorden = await orden.findById(id)
        const menus = await menu.findById(oldorden.idmenu)
        if (parseInt(cantidad) > menus.cantidad_por_dia) {
            return res.status(400).json({ message: 'ya no hay esa cantidad de unidades disponibles ' })
        }
        else {
            var { pagoTotal } = parseFloat(menus.precio) * parseFloat(cantidad)
            await orden.findByIdAndUpdate(id, { cantidad, log, lat, pagoTotal })
            return res.status(200).send({ message: 'orden actualizada' });
        }
    }
}
ctrl.ord = async (req, res) => {
    const ordenes = await orden.find({ iduser: req.userId })
    console.log(ordenes)
    if (!ordenes)
        return res.status(400).json({ message: "El usuario no realizo ninguna orden" });
    else {
        return res.status(200).json(ordenes)
    }
}
//[]listar ordenes solicitadas por usuario (dueño)
ctrl.owall = async (req, res) => {
    var id = req.userId;
    console.log(req.userId)
    const ordenes = []
    rests = await restaurant.find({ propietario: id })
    //console.log(rests)
    if (!rests) {
        return res.status(400).json({ message: "Ud no tiene restaurantes registrados" });
    } else {
        let i = 0
        for (i = 0; i < rests.length; i++) {
            const menus = await menu.find({ id_rest: rests[i].id })
            let j = 0
            if (menus) {
                for (j = 0; j < menus.length; j++) {
                    const ord = await orden.find({ idmenu: menus[i].id })
                    ordenes.push(ord);
                }
            }
        }
        return res.status(400).send(ordenes)
    }
}
ctrl.owmen = async (req, res) => {
    var id = req.params.id;
    console.log(id)
    const ordenes = await orden.find({ idmenu: id })
    if (!ordenes)
        return res.status(400).send("No existen ordenes de este menu")
    else {
        return res.status(200).send(ordenes)
    }
}
ctrl.owsend = async (req, res) => {
    var id = req.params.id;
    const ordenes = await orden.find({ iduser: id })
    if (!ordenes)
        return res.status(200).send("No existen ordenes de este usuario")
    else {
        return res.status(200).send(ordenes)
    }
}

ctrl.delete = async (req, res) => { //N
    const idOrden = req.params.id
    const deleteOrden = await orden.findByIdAndDelete(idOrden)
    if (!deleteOrden)
        return res.status(400).json({ message: "el pedido que intenta eliminar no existe en el carrito" })
    res.status(400).json({ message: "la eliminacion ha sido exitosa exitosa" })
}
ctrl.create = async (req, res) => { //N
    const idOrden = req.params.id
    const findOrden = await findById(idOrden)
    if (!findOrden)
        return res.status(400).json({ message: "el pedido no existe" })
    else {
        const ChangeOrden = await orden.findByIdAndUpdate(idOrden, { estado: 1 })
        if (!ChangeOrden)
            return res.status(500).json({ message: "ha ocurrido un error en el servidor" })
        else
            res.send(findOrden)
        res.status(200).json({ message: "su pedido ha sido enviado correctamente" })
    }
}

ctrl.owtoproc = async (req, res) => { //N
    const idOrden = req.params.id
    const findOrden = await findById(idOrden)
    if (!findOrden)
        return res.status(400).json({ message: "la orden no existe" })
    else {
        const ChangeOrden = await orden.findByIdAndUpdate(idOrden, { estado: 2 })
        if (!ChangeOrden)
            return res.status(500).json({ message: "ha ocurrido un error en el servidor" })
        else
            res.send(findOrden)
        res.status(200).json({ message: "su pedido ha pasado de estado espera a proceso correctamente " })
    }
}

ctrl.owdeliv = async (req, res) => {
    const idUser = req.userId
    const restt = await restaurant.find({ propietario: idUser })
    let menus = []
    for (let i = 0; i < restt.length; i++) {
        const me = await menu.find({ id_rest: restt[i].id })
        if (me.length > 0) {
            for (let k = 0; k < me.length; k++) {
                menus.push(me[k])
            }
        }

    }
    console.log(menus)
    const orders = []
    for (let i = 0; i < menus.length; i++) {
        const or = await orden.find({ idmenu: menus[i].id, estado: 0 })
        if (or.length > 0) {
            for (let k = 0; k < or.length; k++)
                orders.push(or[k])
        }

    }
    res.send(orders)
}
ctrl.wait = async (req, res) => {
    const ords = await orden.find({ iduser: req.userId, estado: 2 })
    res.status(200).json(ords)
}

ctrl.confrec = async (req, res) => {
    const { id } = req.params
    await orden.findByIdAndUpdate(id, { estado: 4 })
    res.status(200).send('acaba de confirmar la orden')
}

ctrl.owtosend = async (req, res) => {
    const { id } = req.params
    await orden.findByIdAndUpdate(id, { estado: 3 })
}
module.exports = ctrl