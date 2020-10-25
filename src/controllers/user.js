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

ctrl.edit = async (req, res) => {
    var id = req.userId;
    var datos = req.body;
    const usser = new user({ password: datos.password });
    usser.password = await usser.encrypt(datos.password);
    datos.password = usser.password;
    //datos.name="elena";
    console.log(datos.name);
    const us =user.findByIdAndUpdate(id, datos, (err, docs) => {
        if (err) {
            res.status(500).json({ msn: "Existen problemas en la base de datos" });
            return;
        } else {
            return res.status(200).json(docs);
        }
    })
    //console.log()
}

ctrl.delete = async (req,res)=>{
    console.log(req.userId)
    await user.findByIdAndDelete(req.userId)
    res.send('el usuario fue eliminado exitosamente')
}

ctrl.mydata = async (req,res)=>{
    console.log(req.userId)
    const userr = await user.findById(req.userId)
    res.status(200).json(userr)
}

/*ctrl.logIn = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/',
})
*/

module.exports = ctrl