const express = require('express');
const bodyParser = require('body-parser');
const consign = require('consign');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');

class AppController {
  constructor() {
    this.app = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cookieParser())
    this.app.use(session({
      secret: 'secretpasssession',
      resave: false,
      saveUninitialized: false
    }));
    this.app.use(bodyParser.urlencoded( {extended: true} ));
    this.app.use(bodyParser.json());
    this.app.use(csrf({ cookie: true }))



    this.app.use(express.static('./public'));
    this.app.engine('hbs', hbs({
      extname: 'hbs', defaultLayout: 'layout', layoutsDir: 'views/layouts/'
    }));
    this.app.set('views', 'views');
    this.app.set('view engine', 'hbs');
  }

  routes() {
    this.app.set('views', './views');

    consign()
        .include('routes')
        .then('dao')
        .into(this.app);
  }
}

module.exports = new AppController().app;
