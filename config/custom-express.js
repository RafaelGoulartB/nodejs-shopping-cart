const express = require('express');
const bodyParser = require('body-parser');
const consign = require('consign');
const hbs = require('express-handlebars');
const path = require('path');

class AppController {
  constructor() {
    this.app = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(bodyParser.urlencoded( {extended: true} ));
    this.app.use(bodyParser.json());
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
        .into(this.app);
  }
}

module.exports = new AppController().app;
