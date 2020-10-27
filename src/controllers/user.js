const ctrl = {}
const {user} = require('../models')
const passport = require('passport')
const {createToken} = require('../helpers/serviceToken')
const saveimage = require('../controllers/image')

ctrl.index = async (req,res)=>{
    const users = await user.find({})
    res.status(200).json(users)
}
ctrl.signUp = async (req,res)=> {
    var usuario= new user
    //console.log(req.body)
    var {name,email,password,confirm_password, avatar} = req.body 
    const users = new user(req.body)
    console.log(users)
    if(name && email && password){  
        const useremail= await user.findOne({email: email}) //no olvidar el await 
        console.log(useremail)
        if (useremail){
            console.log("el email ya esta en uso, ingrese otro diferente")
            return res.send({message: "el email ya esta en uso, ingrese otro diferente", token: "---"})
        }
           
        if(password != confirm_password){
            console.log("las constraseñas no coinciden :/")
            return res.send({message: "las contraseñas no coinciden :/"})
        }
        usuario.name = name;
        usuario.email = email;
        usuario.password = await usuario.encrypt(password);

        const img = await saveimage.cre(req,res)
        if(img == "fail"){
            console.log('el formato no es valido')
            res.send('el formato no es valido')
            return
        }
        else usuario.avatar = img
        //console.log("fghimg is" + img)
        //console.log(usuario)
        await usuario.save((err, usersaved) => {
            if(err) {
                console.log("Error en el servidor")
                return res.send({message: `Error en el servidor ${err}`});
            }
            if(usersaved){
                token = createToken(usersaved.id)
                console.log(usersaved+" registrado")
                res.send({
                    message: "sugoi",
                    token: token
                });
            }else{
                console.log("no se ha guardado el usuario")
                return res.send({
                    message: 'No se ha guardado el usuario'
                });
            } 
        });
    }else{
        console.log("campos vacios"+ name + email + password)
        return res.send({
            message: 'uno o mas campos estan vacios'
        });
    }
}
ctrl.login = async (req,res)=>{
    const {email, password} = req.body
    const userr = await user.findOne({email:email})
    if (!userr) return res.send({
        message: "el usuario no existe"
    })
    const pass = await userr.match(password)
    //console.log(pass)
    if(!pass) return res.send({
        message: "el password es incorrecto"
    })
    token = createToken(userr.id)
    res.send({
        message: "estas logueado",
        token: token
    })
}

ctrl.edAvatar = async (req,res)=>{
    const id = req.userId
    //const userr = await user.findById(id)
    const img = await saveimage.cre(req, res)
    if(img == "fail"){
        console.log("el formato no es")
        res.send("el formato no es valido")
    }else if (img == ""){
        console.log("debe subir un archivo")
        res.send('debe subir un archivo')
    } 
    else {
        await user.findByIdAndUpdate(id, {avatar: img})
        console.log("avatar actualizado")
        res.send({message: "avatar actualizado"})
    }
}

ctrl.edit = async (req, res) => {
    var id = req.userId;
    var {name,email,password,confirm_password} = req.body 
    if(name && email && password){  
        const useremail= await user.findOne({email: email}) //no olvidar el await 
        console.log(useremail)
        if (useremail){
            console.log("el email ya esta en uso, ingrese otro diferente")
            return res.send({message: "el email ya esta en uso, ingrese otro diferente"})
        }
        if(password != confirm_password){
            console.log("las constraseñas no coinciden :/")
            return res.send({message: "las contraseñas no coinciden :/"})
        }
        const usser = new user({ password: password });
        usser.password = await usser.encrypt(password);
        password = usser.password;

        const us =user.findByIdAndUpdate(id, {name, email, password}, (err, docs) => {
            if (err) {
                res.send({ message: "Existen problemas en la base de datos" });
                return;
            } else {
                console.log("usuario actualizado")
                return res.send({message: "sugoi"});
            }
        })
    }else{
        console.log("campos vacios"+ name + email + password)
        return res.send({
            message: 'uno o mas campos estan vacios'
        });
    }
}

ctrl.delete = async (req,res)=>{
    console.log(req.userId)
    await user.findByIdAndDelete(req.userId)
    res.send({message: 'esto no es sugoi'})
}

ctrl.mydata = async (req,res)=>{
    console.log(req.userId)
    const userr = await user.findById(req.userId)
    res.status(200).json(userr)
}

module.exports = ctrl