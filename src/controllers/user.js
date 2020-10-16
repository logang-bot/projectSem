const ctrl = {}
const {user} = require('../models')
const passport = require('passport')
const {createToken} = require('../helpers/serviceToken')

ctrl.index = async (req,res)=>{
    const users = await user.find({})
    res.status(200).json(users)
}
ctrl.signUp = async (req,res)=> {
    var usuario= new user
    //console.log(req.body)
    var {name,email,password,confirm_password} = req.body 

    if(name && email && password){  
        const useremail= await user.findOne({email: email}) //no olvidar el await 
        console.log(useremail)
        if (useremail)
           return res.status(400).json({message: "el email ya esta en uso, ingrese otro diferente"})
        if(password != confirm_password)
            return res.status(400).json({message: "las constraseñas no coinciden :/"})
        usuario.name = name;
        usuario.email = email;
        usuario.password = await usuario.encrypt(password); 
        console.log(usuario)
        await usuario.save((err, usersaved) => {
            if(err) return res.status(500).send({message: `Error en el servidor ${err}`});
            if(usersaved){
                token = createToken(usersaved.id)
                res.status(200).send({
                usuario: usersaved,
                token: token 
            });
            }else{
                return res.status(500).send({
                    message: 'No se ha guardado el usuario'
                });
            } 
        });
    }else{
        return res.status(400).send({
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
/*ctrl.logIn = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/',
})
*/

module.exports = ctrl