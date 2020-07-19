const router  = require('express').Router()
const {user, restaurant, menu, orden} = require('../controllers')
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

router.get('/res',restaurant.index)
router.get('/res/list',auth,restaurant.index2)
router.post('/res/create',auth,restaurant.create)
router.put('/res/edit/:id',restaurant.edit)
router.patch('/res/chang/:id',auth, restaurant.change)
router.delete('/res/delete/:id',restaurant.delete)

//rutas para menu
router.get('/menu/:idRes',menu.index)
router.post('/menu/create/:idRes',menu.create)
router.put('/menu/edit/:id',menu.edit)
router.delete('/menu/delete/:id',menu.delete)

//rutas para orden
//user
router.get('/orden/listcart',auth, orden.index)
router.post('/orden/cart/:idMenu',auth, orden.cart)
router.put('/orden/edit/:id', orden.edit)
/*
router.get('/orden/listwait',auth, orden.wait)
router.put('/orden/confirmrec',auth, orden.confrec)
router.put('/orden/ow/tosend',auth, orden.owtosend)

router.get('/orden/test/:idRes', orden.test)
/*router.put('/orden/edit/:id', orden.edit)
router.delete('/orden/delete/:id', orden.delete)
router.put('/orden/create/:id', orden.create)*/
router.get('/orden/list',auth, orden.ord)
/*router.get('/orden/listwait',auth, orden.wait)
router.put('/orden/confirmrec',auth, orden.confrec)
//owner
router.get('/orden/ow/listall', orden.owall)
router.get('/orden/ow/listres', orden.owres)
router.get('/orden/ow/listmen', orden.owmen)
router.put('/orden/ow/toproc', orden.owtoproc)
router.put('/orden/ow/tosend', orden.owtosend)
router.get('/orden/ow/listsend', orden.owsend)
router.get('/orden/ow/listdeliv', orden.owdeliv)*/

module.exports = router