//controlador de menu
const ctrl = {}
const { menu,restaurant } = require('../models')


ctrl.index = async (req, res) => {
    const f_resta = await restaurant.findOne({ id: req.params.idRes })
    if (!f_resta)
        return res.status(400).json ({message: "no existe el restaurant"});
    else{
        const menus= await menu.find({ id_res : f_resta})
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