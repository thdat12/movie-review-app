const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const connectDB = require('./config/db')

dotenv.config({ path: './config/config.env' })

// Passport
require('./config/passport')(passport)

connectDB()

const PORT = process.env.PORT || 5000

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body == 'object' && '_method' in req.body) {
    let method = req.body._method
    delete req.body._method
    return method
  }}
))

const { formatDate, truncate, stringTags, editIcon, select } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs({ helpers: { formatDate, stringTags, truncate, editIcon, select }, defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')


app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  maxAge: 24 * 60 * 60 * 1000
}))

// Passport midlleware
app.use(passport.initialize())
app.use(passport.session())

app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/reviews', require('./routes/reviews'))

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))