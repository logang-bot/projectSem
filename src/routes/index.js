const router  = require('express').Router()
const {user, restaurant,menu} = require('../controllers')
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
router.delete('/menu/delete/:id',menu.delete)
/*router.post('/menu/create',menu.create)
router.put('/menu/edit/:id',menu.edit)


//rutas para orden
router.get('/orden',orden.index),
router.post('/orden/create',orden.create)
router.put('/orden/edit/:id',orden.edit)
router.delete('/orden/delete/:id',orden.delete)*/

module.exports = router