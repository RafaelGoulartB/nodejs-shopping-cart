module.exports = app => {

  app.get('/', (req, res) => {
    const connection = app.dao.connectionFactory();
    const productsDAO = new app.dao.productsDAO(connection);
    productsDAO.list()
      .then(products => {
        console.log(products);
        res.status(200).render('shop/index', {title: 'Shopping Cart', products: products})
      }
      )
      .catch(err => res.status(400).send(err));


  });

}
