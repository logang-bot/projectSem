const ctrl = {}
const { user, restaurant, menu } = require('../models')
const saveimage = require('../controllers/image')

ctrl.index = async (req, res) => {
    const rests = await restaurant.find({})
    res.send(rests)
}
ctrl.index2 = async (req, res) => {
    const resta = await restaurant.find({ propietario: req.userId })
    if (resta)
        return res.status(200).json(resta)
    else
        return res.status(400).json({ message: "El usuario no tiene restaurantes" })
}

ctrl.create = async (req, res) => {
    var newresta = new restaurant
    var { nombre, nit, calle, telefono, log, lat } = req.body

    if (nombre && nit && calle && telefono) {
        const bnombre = await restaurant.findOne({ nombre: nombre }) //consulta a la DB
        const bnit = await restaurant.findOne({ nit: nit })
        if (bnombre)
            return res.send({ message: "el nombre ya esta en uso, ingrese otro diferente" })
        if (bnit)
            return res.send({ message: "el nit ya esta en uso, ingrese otro diferente" })
        newresta.nombre = nombre;
        newresta.nit = nit;
        newresta.propietario = req.userId; //id del usuario
        newresta.calle = calle;
        newresta.telefono = telefono;
        //newresta.log = log;
        //newresta.lat = lat;


        const img = await saveimage.cre(req,res)
        if(img == "fail"){
            res.send('el formato no es valido')
            return
        }
        else newresta.logo = img
        console.log("fghimg is" + img)



        await newresta.save((err, restsaved) => {
            if (err)
                return res.send({ message: `Error en el servidor ${err}` });
            if (restsaved) {
                console.log("El restaurant fue creado correctamente")
                return res.send({
                    message: 'El restaurant fue creado correctamente',
                    _id: restsaved.id
                });
            } else {
                return res.send({
                    message: 'No se ha guardado el restaurante'
                });
            }

        });
    } else {
        return res.send({
            message: 'uno o mas campos estan vacios'
        });
    }
}
ctrl.edit = async (req, res) => {
    const id = req.query.id
    var { nombre, nit, calle, telefono} = req.body
    if (nombre && nit && calle && telefono) {
        const bnombre = await restaurant.findOne({ nombre: nombre }) //consulta a la DB
        const bnit = await restaurant.findOne({ nit: nit })
        if (bnombre) {
            if (req.userId != bnombre.propietario) {
                return res.send({ message: "el nombre ya esta en uso, ingrese otro diferente" })
            }
        }
        if (bnit){
            if (req.userId != bnit.propietario) {
                return res.send({ message: "el nit ya esta en uso, ingrese otro diferente" })
            }
        }
        await restaurant.findByIdAndUpdate(id, { nombre, nit, calle, telefono})
        await menu.updateMany({id_rest: id}, {resta:nombre})
        res.send({message: "Fue actualizado correctamente"})
    } else {
        return res.send({
            message: 'uno o mas campos estan vacios'
        });
    }
}

ctrl.change = async (req, res) => {
    const { id } = req.query
    const email = req.body.email
    const newuser = await user.findOne({ email: email })
    const rest = await restaurant.findById(id)
    if (newuser) {
        console.log(rest.propietario)
        console.log(newuser.id)
        if (rest.propietario == req.userId) {
            await restaurant.findByIdAndUpdate(id, { propietario: newuser._id.toString() })
            res.send('cambio de propietario exitoso')
        }
        else {
            res.send('no eres el actual propietario de este restaurant')
        }
    }
    else {
        res.send('el usuario no esta registrado')
    }
}

ctrl.delete = async (req, res) => {
    const id = req.query.id
    await restaurant.findByIdAndDelete(id)
    res.send({message:'El restaurant fue eliminado exitosamente'})
}

ctrl.setlugar = async (req,res)=>{
    const { id } = req.query
    const restt = await restaurant.findById(id)
    const userr = await user.findById(req.userId)
    if (restt.propietario == userr.id) {
        const img = await saveimage.cre(req, res)
        if (img == "fail") {
            res.send({message: "el formato no es valido"})
        } else if (img == "") res.send('debe subir un archivo')
        else {
            await restaurant.findByIdAndUpdate(id, { foto: img })
            console.log('foto del lugar agregada')
            res.send({message : 'Foto del lugar agregada'})
        }
    }
    else {
        console.log(restt.idPropietario)
        console.log(userr._id)
        res.send({message: 'no eres el propietario actual de este negocio'})
    }
}

ctrl.setlogo = async (req,res)=>{
    const {id} = req.query
    if(id == null || id==""){
        console.log("no hay id de Rest")
        return res.send({message: "no hay id de Rest"})
    }
    const img = await saveimage.cre(req, res)
    if(img == "fail"){
        res.send({message: "el formato no es valido"})
    }else if (img == "") res.send('debe subir un archivo')
    else {
        await restaurant.findByIdAndUpdate(id, {logo: img})
        res.send({message: 'Logo actualizado'})
    }
}

/*
ctrl.lugar = async (req,res) => {
    const { id } = req.params
    const restt = await restaurant.findById(id)
    const userr = await user.findById(req.user.id)
    if (restt.idPropietario._id.equals(userr._id)) {
        const img = await saveimage.cre(req, res)
        if (img == "fail") {
            res.send("el formato no es valido")
        } else if (img == "") res.send('debe subir un archivo')
        else {
            await restaurant.findByIdAndUpdate(id, { FotoLugar: img })
            console.log('foto del lugar agregada')
            res.send('Foto del lugar agregada')
        }
    }
    else {
        console.log(restt.idPropietario)
        console.log(userr._id)
        res.send('no eres el propietario actual de este negocio')
    }
    
}

ctrl.editLogo = async (req,res)=>{
    const {id} = req.params
    const img = await saveimage.cre(req, res)
    if(img == "fail"){
        res.send("el formato no es valido")
    }else if (img == "") res.send('debe subir un archivo')
    else {
        await restaurant.findByIdAndUpdate(id, {Logo: img})
        res.send('Logo actualizado')
    }
}

ctrl.editFotoLugar = async (req,res)=>{
    const {id} = req.params
    const img = await saveimage.cre(req, res)
    if(img == "fail"){
        res.send("el formato no es valido")
    }else if (img == "") res.send('debe subir un archivo')
    else {
        await restaurant.findByIdAndUpdate(id, {FotoLugar: img})
        res.send('Foto del lugar actualizado')
    }
}*/
/////////////////
ctrl.delLogo = async (req,res)=>{
    const {id} = req.query
    await restaurant.findByIdAndUpdate(id, {logo: ""})
    res.send('Logo eliminado')
}

ctrl.delFotoLugar = async (req,res)=>{
    const {id} = req.query
    await restaurant.findByIdAndUpdate(id, {foto: ""})
    res.send('Foto del lugar eliminado')
}

/////////////////

ctrl.setlocation = async (req,res)=>{
    const {id} = req.query
    if(id == null || id==""){
        console.log("no hay id de Rest")
        return res.send({message: "no hay id de Rest"})
    }
    const {log, lat} = req.body
    await restaurant.findByIdAndUpdate(id,{log, lat})
    res.send({message: 'ubicacion actualizada'})
}

ctrl.mydata = async (req,res) => {
    console.log(req.query)
    const idRes =req.query.id
    const rest = await restaurant.findById(idRes)
    res.status(200).json(rest)
}

ctrl.search = async(req,res)=>{
    const {word} = req.query
    const rests = await restaurant.find({ nombre:{ $regex : word, $options : 'i'} })
    res.send(rests)
}

ctrl.propdata = async(req,res)=>{
    const idRes =req.userId
    const datosProp= await user.findById(idRes)
    console.log(datosProp.name)
    res.send({message: datosProp.name})
}

module.exports = ctrl
