//controlador de menu
const ctrl = {}
const { menu,restaurant } = require('../models')
const saveimage = require('../controllers/image')

ctrl.index = async (req, res) => {
    const f_resta = await restaurant.findOne({ _id: req.query.idRes })
    console.log(f_resta)

    if (!f_resta)
        return res.status(400).json ({message: "no existe el restaurant"});
    else{
        const menus= await menu.find({ id_rest : f_resta.id})
        if (menus)
            return res.status(200).json(menus)
        return res.status(400).json({ message: "Este restaurant no tiene menus " })
    }
}
ctrl.create = async (req,res)=>{
    const {nombre, precio, descripcion, cantidad_por_dia} = req.body
    const errors = []
    if(!nombre) errors.push({error: 'por favor introduzca un nombre'})
    if(!precio) errors.push({error: 'el precio tiene que ser mayor a cero'})
    if(!descripcion) errors.push({error: 'es necesario una descripcion del producto'})
    if(!cantidad_por_dia) errors.push({error: "la cantidad por dia es requerida"})
    if(errors.length>0) return res.status(501).json(errors)
    else{
        const men = await menu.findOne({nombre, id_rest: req.query.idRes})
        if(men) return res.send('ya registro un producto con este nombre')
        else{
            const newmenu  = new menu(req.body)
            const {idRes} = req.query
            newmenu.id_rest = idRes
            const auxrest = await restaurant.findById(idRes)
            newmenu.resta = auxrest.nombre
            newmenu.imgresta = auxrest.logo
            const img = await saveimage.cre(req,res)
            if(img == "fail"){
                res.send('el formato no es valido')
                return
            }
            else newmenu.foto = img
            //console.log("fghimg is" + img)

            await newmenu.save()
            res.send({message: 'menu creado satisfactoriamente'})
        }
    }
}


ctrl.index = async (req, res) => {
    const f_resta = await restaurant.findOne({ _id: req.query.idRes })
    if (!f_resta)
        return res.status(400).json ({message: "no existe el restaurant"});
    else{
        const menus= await menu.find({ id_rest : f_resta.id})
        if (menus)
            return res.status(200).json(menus)
        return res.status(400).json({ message: "Este restaurant no tiene menus " })
    }
}
ctrl.edit = async (req, res) => {
    const id = req.query.id
    var datos = req.body;
    if(!datos.nombre || !datos.precio || !datos.descripcion || !datos.cantidad_por_dia){
        return res.status(400).send({message: 'No se permite campos vacios'});
    }else {
        const oldmenu=await menu.findById(id)
        console.log(oldmenu)
        const menus = await menu.findOne({ nombre: datos.nombre, id_rest:oldmenu.id_rest})

        if(!menus){
            await menu.findByIdAndUpdate(id,datos)
            return res.status(200).send({message: 'Datos actualizados'});
        }else
        return res.status(400).send({message: 'Ya existe ese producto'});
    }
}


ctrl.delete = async (req,res) => {
    const idMenu = req.query.id
    const d_menu= await menu.findByIdAndDelete(idMenu)
    if(!d_menu)
        return res.status(400).json({message: "el menu que intenta eliminar no existe"})
    res.status(400).json({message: "eliminacion exitosa"})
}

ctrl.search = async (req,res)=>{
    /*const menuss = await menu.find({})
    res.send(menuss)*/
    const {word} = req.query
    const menus = await menu.find({ nombre:{ $regex : word, $options : 'i'} })
    res.send(menus)
}

ctrl.mydata = async (req,res)=>{
    console.log(req.query)
    const idMenu =req.query.id
    const menuu = await menu.findById(idMenu)
    res.send(menuu)
}

ctrl.aux = async (req,res)=>{
    const idMenu = req.query.id
    const targetMenu = await menu.findByIdAndUpdate(idMenu, {imgresta: req.body.resta})
    res.send('ok')
}

ctrl.data = async (req,res) => {
    console.log(req.query)
    const idRes =req.query.idRes
    const menu = await menu.findOne({id_rest: idRes})
    res.status(200).json(menu)
}

module.exports = ctrl
