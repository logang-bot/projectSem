const express  = require('express')
const app = express()
const routes = require('../routes')
app.set('port', process.env.PORT || 8000)

app.use('/', routes)

module.exports = app
