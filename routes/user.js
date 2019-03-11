module.exports = app => {
  app.get('/user/signup', (req, res, next) => {
    const success = req.session['success'];
    req.session['success'] = null;
    const warning = req.session['warning'];
    req.session['warning'] = null;

    res.render('user/signup', {
      title: 'Sign Up',
      csrfToken: req.csrfToken(),
      success, warning,
    });
  });

  app.post('/user/signup', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const connection = app.dao.connectionFactory();
    const userDao = new app.dao.userDAO(connection);

    req.checkBody('email', 'Please enter with a valid email!').isEmail().notEmpty();
    req.checkBody('password', 'The password must be at least 4 digits!').notEmpty().isLength({min:4});
    const errosInValidation = req.validationErrors();
    if (errosInValidation) {
      req.session['warning'] = errosInValidation[0].msg;
      res.redirect('/user/signup');
      return;
    }

    userDao.saveUser(email, password)
      .then(result => {
        req.session['success'] = result;
        res.redirect('/');
      })
      .catch(err => {
        req.session['warning'] = err;
        res.redirect('/user/signup');
        return;
      });
  });
}
