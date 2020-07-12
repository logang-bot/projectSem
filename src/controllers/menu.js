//controlador de menu
const ctrl = {}
const { menu,restaurant } = require('../models')

ctrl.edit = async (req, res) => {
    const id = req.params.id
    var datos = req.body;

    if(datos.nombre || datos.precio || datos.descripcion){
        return res.status(400).send({message: 'No se permite campos vacios'});
    }else {
        const menus = await menu.findOne({ nombre: datos.nombre, id_rest:req.params.idRes })
        if(!menus){
            await menu.findByIdAndUpdate(id,datos)
            return res.status(200).send({message: 'Datos actualizados'});
        }else
        return res.status(400).send({message: 'Ya existe ese producto'});
    }
}