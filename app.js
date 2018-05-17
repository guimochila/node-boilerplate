// Load variables.env files with the App configuration variables
require('dotenv').config({ path: './variables.env' });

const express = require('express');
const session = require('express-session');
const expressValidator = require('express-validator');
const exphbs = require('express-handlebars');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');

const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');

// Load mongoose models
require('./models/User');

// Load Password Strategies
require('./config/passport');

// Load Routes
const routes = require('./routes/index');

const app = express();

// BodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handlebars Middleware
const hbs = exphbs.create({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir: 'views/layouts',
  partialsDir: [path.join(__dirname, 'views/partials')],
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Express session stored on MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.user = req.user || null;
  next();
});

// Express static middleware
app.use(express.static(path.join(__dirname, 'public')));

// Exposes many methods for validating data. Used on userController.validateRegister
app.use(expressValidator());

// Handle our own routes
app.use('/', routes);

// Error Hanlding
app.use(errorHandlers.notFound);

if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors);
}

app.use(errorHandlers.errorRender);

// Done! We export it so we can use in the start.js file
module.exports = app;
