module.exports = app => {
  app.get('/cart', (req, res) => {
    const success = req.session['success'];
    req.session['success'] = null;
    const warning = req.session['warning'];
    req.session['warning'] = null;

    const productsIdInCart = req.cookies['productsid-in-cart'];
    if (productsIdInCart.length == 0)
      return res.status(200).render('cart/index', {
        title: 'Cart',
        products: [],
        warning: `You don't add items in your cart!`,
        numOfitemsInCart: req.cookies['productsid-in-cart'].length,
      });

    const connection = app.dao.connectionFactory();
    const ProductsDao = new app.dao.productsDAO(connection);

    ProductsDao.getByIds(productsIdInCart)
      .then(products => {
        let totalPrice = 0;
        products.forEach(product => {
          totalPrice += product.price;
        });
        res.status(200).render('cart/index',
          {
            title: 'Cart',
            products,
            success, warning,
            numOfitemsInCart: req.cookies['productsid-in-cart'].length,
            totalPrice,
          }
        )
      })
      .catch(err => res.status(400).send(err));

  });

  app.get('/cart/add-to-cart/:id', (req, res) => {
    const productId = +req.params.id;
    let productsIdInCart = req.cookies['productsid-in-cart'];

    if (productsIdInCart == undefined) productsIdInCart = [];

    const isNotInList = productsIdInCart.indexOf(productId) == -1;
    if (isNotInList) productsIdInCart.push(productId);

    console.log(productsIdInCart);
    res.cookie('productsid-in-cart', productsIdInCart, { maxAge: 99999999999 });

    res.redirect('/');
  });

  app.get('/cart/remove-to-cart/:id', (req, res) => {
    const productId = +req.params.id;
    let productsIdInCart = req.cookies['productsid-in-cart'];
    let indexOfProduct = productsIdInCart.indexOf(productId);
    if (indexOfProduct > -1) {
      productsIdInCart.splice(indexOfProduct, 1);
    }
    res.cookie('productsid-in-cart', productsIdInCart, { maxAge: 99999999999 });

    res.redirect('/cart/');
  });
};
