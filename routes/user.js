module.exports = app => {
  // Sign Up
  app.get('/user/signup', (req, res, next) => {
    if (req.session['user'] || req.session['user'] != null) {
      req.session['warning'] = 'You are not able to access this area!';
      return res.redirect('/')
    }

    const success = req.session['success'];
    req.session['success'] = null;
    const warning = req.session['warning'];
    req.session['warning'] = null;

    res.render('user/signup', {
      title: 'Sign Up',
      csrfToken: req.csrfToken(),
      success, warning,
      login: req.session['user'],
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
        req.session['user'] = email;
        res.redirect('/');
      })
      .catch(err => {
        req.session['warning'] = err;
        res.redirect('/user/signup');
        return;
      });
  });
  // Sign In
  app.get('/user/signin', (req, res) => {
    if (req.session['user'] || req.session['user'] != null) {
      req.session['warning'] = 'You are not able to access this area!';
      return res.redirect('/')
    }

    const success = req.session['success'];
    req.session['success'] = null;
    const warning = req.session['warning'];
    req.session['warning'] = null;

    res.render('user/signin', {
      title: 'Sign In',
      csrfToken: req.csrfToken(),
      success, warning,
      login: req.session['user'],
    });
  });
  app.post('/user/signin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const connection = app.dao.connectionFactory();
    const userDao = new app.dao.userDAO(connection);

    req.checkBody('email', 'Please enter with a valid email!').isEmail().notEmpty();
    req.checkBody('password', 'The password must be at least 4 digits!').notEmpty();
    const errosInValidation = req.validationErrors();
    if (errosInValidation) {
      req.session['warning'] = errosInValidation[0].msg;
      res.redirect('/user/signin');
      return;
    }

    userDao.login(email, password)
      .then(result => {
        req.session['user'] = email;
        req.session['success'] = result;
        res.redirect('/user/profile');
      })
      .catch(err => {
        req.session['warning'] = err;
        res.redirect('/user/signin');
        return;
      });
  });

  // Profile
  app.get('/user/profile', (req, res) => {
    if (!req.session['user'] || req.session['user'] == null) {
      req.session['warning'] = 'You do not have permission to access this area!';
      return res.redirect('/');
    }

    const success = req.session['success'];
    req.session['success'] = null;
    const warning = req.session['warning'];
    req.session['warning'] = null;

    res.render('user/profile', {
      title: 'Profile',
      success, warning,
      login: req.session['user'],
    });
  });

  app.get('/user/logout', (req, res) => {
    if (!req.session['user'] || req.session['user'] == null) {
      req.session['warning'] = 'You do not have permission to access this area!';
      return res.redirect('/');
    }

    req.session['user'] = null;
    res.redirect('/');
  });

}
