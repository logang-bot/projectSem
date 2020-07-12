//controlador de menu
const ctrl = {}
const { menu,restaurant } = require('../models')

ctrl.create = async (req,res)=>{
    const {nombre, precio, descripcion, foto} = req.body
    const errors = []
    if(!nombre) errors.push({error: 'por favor introduzca un nombre'})
    if(!precio) errors.push({error: 'el precio tiene que ser mayor a cero'})
    if(!descripcion) errors.push({error: 'es necesario una descripcion del producto'})
    if(errors.length>0) return res.status(501).json(errors)
    else{
        const men = await menu.findOne({nombre, id_rest: req.params.idRes})
        if(men) return res.send('ya registro un producto con este nombre')
        else{
            const newmenu  = new menu(req.body)
            const {idRes} = req.params
            newmenu.id_rest = idRes
            await newmenu.save()
            res.status(200).json({message: 'menu creado satisfactoriamente'})
        }
    }
}


ctrl.index = async (req, res) => {
    const f_resta = await restaurant.findOne({ _id: req.params.idRes })
    if (!f_resta)
        return res.status(400).json ({message: "no existe el restaurant"});
    else{
        const menus= await menu.find({ id_rest : f_resta.id})
        if (menus)
            return res.status(200).json(menus)
        return res.status(400).json({ message: "Este restaurant no tiene menus " })
    }
}

ctrl.delete = async (req,res) => {
    const idMenu = req.params.id
    const d_menu= await menu.findByIdAndDelete(idMenu)
    if(!d_menu)
        return res.status(400).json({message: "el menu que intenta eliminar no existe"})
    res.status(400).json({message: "eliminacion exitosa"})
}
    

module.exports = ctrl