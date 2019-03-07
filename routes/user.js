module.exports = app => {
  app.get('/user/signup', (req, res, next) => res.render('user/signup',
    {
      title: 'Sign Up',
      csrfToken: req.csrfToken()
    }
  ));

  app.post('/user/signup', (req, res, next) => res.redirect('/'));
}
