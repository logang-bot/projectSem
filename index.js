const express  = require('express')
const app = express()

app.set('port', process.env.PORT || 8000)

app.listen(app.get('port'), ()=>{
    console.log(`server running in ${app.get('port')} :)`)
})
