module.exports = app => {

  app.get('/', (req, res) => {
    res.render('shop/index', {title: 'hbs'});
  });

}
