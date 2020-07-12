const router  = require('express').Router()
const {user,restaurant} = require('../controllers')
const auth = require('../helpers/auth')

router.get('/', auth, (req,res)=>{
    if(req.user) console.log(req.user.id)
    else console.log('empty')
    res.send('que pex')
})

//rutas para usuario
router.get('/user',user.index),
router.post('/user/signUp',user.signUp)
router.post('/user/logIn',user.login)
router.put('/user/edit',auth ,user.edit)
router.delete('/user/delete', auth , user.delete)



//rutas para restaurant

router.post('/res/create',auth,restaurant.create)
router.put('/res/edit',restaurant.edit)
/*
router.get('/res',res.index),
router.delete('/res/delete/:id',res.delete)

//rutas para menu
router.get('/menu',menu.index),
router.post('/menu/create',menu.create)
router.put('/menu/edit/:id',menu.edit)
router.delete('/menu/delete/:id',menu.delete)

//rutas para orden
router.get('/orden',orden.index),
router.post('/orden/create',orden.create)
router.put('/orden/edit/:id',orden.edit)
router.delete('/orden/delete/:id',orden.delete)*/

module.exports = router