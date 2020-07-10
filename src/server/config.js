const express  = require('express')
const app = express()
const morgan = require('morgan')
const session = require('express-session')
const passport = require('passport')
const routes = require('../routes')

require('../config/passport')

app.set('port', process.env.PORT || 8000)
app.use(morgan('dev'))

app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: 'appsecret',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes)

module.exports = app
