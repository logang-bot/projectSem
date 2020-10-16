const router  = require('express').Router()
const {user, restaurant, menu, orden} = require('../controllers')
const auth = require('../helpers/auth')
const fileupload = require('express-fileupload')

router.use(fileupload({
    fileSize: 50*1024*1024
}))

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
router.get('/orden/listcart',auth, orden.index) //listar pedidos G
router.post('/orden/cart/:idMenu',auth, orden.cart) //creacion pedido G
router.put('/orden/edit/:id', orden.edit) // actua pedido R
router.delete('/orden/delete/:id', orden.delete) //Eliminar pedido N
router.put('/orden/create/:id', orden.create)//confirmar orden N
router.get('/orden/list',auth, orden.ord) // listar ordenes R
router.get('/orden/listwait',auth, orden.wait) //listar en espera por usuario G
router.put('/orden/confirmrec',auth, orden.confrec) // confirmar recepcion G
//                              OWNER    

router.get('/orden/ow/listall',auth, orden.owall) // listar ordenes solicitadas por usuario (dueño) R
router.get('/orden/ow/listres/:idRes', orden.owres) //listar ordenes solicitadas por restaurant (dueño) N g
router.get('/orden/ow/listmen/:id', orden.owmen) // ]listar ordenes solicitadas por menu (dueño) R
router.put('/orden/ow/toproc/:id', orden.owtoproc) //cambiar de estado espera a proceso N
router.put('/orden/ow/tosend',auth, orden.owtosend) //cambiar de estado proceso a enviado G
router.get('/orden/ow/listsend/:id', orden.owsend) //listar ordenes enviadas por usuario (dueño) R
router.get('/orden/ow/listdeliv', auth, orden.owdeliv) //  listar ordenes entregadas por usuario (dueño)N g



module.exports = router