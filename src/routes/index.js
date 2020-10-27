const router  = require('express').Router()
const {user, restaurant, menu, orden, imagen} = require('../controllers')
const auth = require('../helpers/auth')
const fileupload = require('express-fileupload')
const image = require('../models/image')

router.use(fileupload({
    fileSize: 50*1024*1024
}))

router.get('/', auth, (req,res)=>{
    if(req.user) console.log(req.user.id)
    else console.log('empty')
    res.send('que pex')
})

//rutas prueba imagen
router.get('/img/:id', imagen.get)


//rutas para usuario
router.get('/user',user.index)
router.post('/user/signUp',user.signUp)
router.post('/user/logIn',user.login)
router.put('/user/edit',auth ,user.edit)
router.delete('/user/delete', auth , user.delete)
router.get('/user/mydata', auth, user.mydata)
    //rutas para imagen
router.put('/user/edAvatar', auth, user.edAvatar)

//rutas para restaurant
router.get('/res',restaurant.index)
router.get('/res/list',auth,restaurant.index2)
router.post('/res/create',auth,restaurant.create)
router.put('/res/edit',auth,restaurant.edit)     // REQ ID RESTAURANT
router.patch('/res/chang',auth, restaurant.change) // REQ ID RESTAURANT
router.delete('/res/delete',restaurant.delete) // REQ ID RESTAURANT
router.get('/res/search', restaurant.search) // query keyword

    //rutas para imagen
router.post('/res/setcover', auth, restaurant.setlugar) // REQ ID RESTAURANT
router.post('/res/setlogo', auth, restaurant.setlogo) // REQ ID RESTAURANT
/*router.put('/res/fotolugar/:id', auth, restaurant.lugar)
router.put('/res/edlogo/:id', auth, restaurant.editLogo)
router.put('/res/edfoto/:id', auth, restaurant.editFotoLugar)*/
router.put('/res/dellogo', auth, restaurant.delLogo)  // REQ ID RESTAURANT
router.put('/res/delfoto', auth, restaurant.delFotoLugar)  // REQ ID RESTAURANT
router.get('/res/mydata', auth, restaurant.mydata) 

//rutas para menu
router.get('/menu',menu.index)   // QUERY ID RESTAURANT ON MENU
router.post('/menu/create',menu.create)  // QUERY ID RESTAURANY ON MENU
router.put('/menu/edit',menu.edit) // QUERY ID MENU
router.delete('/menu/delete',menu.delete)  // QUERY ID MENU
router.get('/menu/search', menu.search) // query keyword
router.get('/menu/mydata', menu.mydata)
    //aux
    router.post('/menu/aux/upd', menu.aux)

//rutas para orden
//user
router.get('/orden/listcart',auth, orden.index) //listar pedidos G
router.post('/orden/cart',auth, orden.cart) //creacion pedido G  //QUERY ID
router.put('/orden/edit', orden.edit) // actua pedido R  // QUERY ID ORDEN
router.delete('/orden/delete', orden.delete) //Eliminar pedido N  //QUERY ID ORDEN
router.put('/orden/create', orden.create)//confirmar orden N    //QUERY ID ORDEN
router.get('/orden/list',auth, orden.ord) // listar ordenes R
router.get('/orden/listwait',auth, orden.wait) //listar en espera por usuario G
router.put('/orden/confirmrec',auth, orden.confrec) // confirmar recepcion G
router.put('/orden/solicitarf',auth, orden.fac)// Solicitar factura R
//                              OWNER    

router.get('/orden/ow/listall',auth, orden.owall) // listar ordenes solicitadas por usuario (dueño) R
router.get('/orden/ow/listres', orden.owres) //listar ordenes solicitadas por restaurant (dueño) N g //     QUERY ID REST
router.get('/orden/ow/listmen', orden.owmen) // ]listar ordenes solicitadas por menu (dueño) R //QUERY ID
router.put('/orden/ow/toproc', orden.owtoproc) //cambiar de estado espera a proceso N  //QUERY ID
router.put('/orden/ow/tosend',auth, orden.owtosend) //cambiar de estado proceso a enviado G
router.get('/orden/ow/listsend', orden.owsend) //listar ordenes enviadas por usuario (dueño) R //QUERY ID
router.get('/orden/ow/listdeliv', auth, orden.owdeliv) //  listar ordenes entregadas por usuario (dueño)N g

module.exports = router