module.exports = app => {

  app.get('/', (req, res) => {
    const success = req.session['success'];
    req.session['success'] = null;
    const warning = req.session['warning'];
    req.session['warning'] = null;

    const connection = app.dao.connectionFactory();
    const productsDAO = new app.dao.productsDAO(connection);
    productsDAO.list()
      .then(products => res.status(200).render('shop/index',
      {
          title: 'Shopping Cart',
          products,
          numOfitemsInCart: req.cookies['productsid-in-cart'].length,
          success, warning,
          login: req.session['user'],
      }
      ))
      .catch(err => res.status(400).send(err));
  });

}
