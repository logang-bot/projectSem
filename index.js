const app = require('./src/server/config')
require("./db")
app.listen(app.get('port'), ()=>{
    console.log(`server running in ${app.get('port')} :)`)
})