const router  = require('express').Router()

router.get('/', (req,res)=>{
    res.send('que pex')
})

module.exports = router