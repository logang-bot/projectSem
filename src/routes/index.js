const router  = require('express').Router()
const {user} = require('../controllers')

router.get('/', (req,res)=>{
    res.send('que pex')
})

//rutas para usuario
router.get('/user',user.index),
/*router.post('/user/signUp',user.signUp)
router.post('/user/logIn',user.logIn)
router.put('/user/edit/:id',user.edit)
router.delete('/user/delete/:id',user.delete)
/*
//rutas para restaurant
router.get('/res',res.index),
router.post('/res/create',res.create)
router.put('/res/edit/:id',res.edit)
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