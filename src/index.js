const express = require('express')
const morgan = require('morgan')
const path = require('path')
const exphbs = require('express-handlebars')
const flash = require("connect-flash")
const session = require("express-session")
const MYSQLStore = require("express-mysql-session")
const passport = require('passport')

const { database } = require('./keys')

// Intializations
const app = express()
require('./lib/passport')

// Settings
app.set('port', process.env.PORT || 4000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs')

// Middlewares
app.use(session({
  secret: 'maujoMYSQLNodeSession',
  resave: false,
  saveUninitialized: false,
  store: new MYSQLStore(database)
}))
app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

// Global variables
app.use((req, res, next) => {
  app.locals.success = req.flash('success')
  app.locals.message = req.flash('message')
  app.locals.user = req.user
  next()
})

// Routes
app.use('/cartera', require('./routes/cartera'))
app.use('/', require('./routes/authentication'))
app.use('/', require('./routes/index'))

// Public
app.use(express.static(path.join(__dirname, 'public')))

// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'))
})
