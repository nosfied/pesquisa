exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
  };
  
  exports.checkCsrfError = (err, req, res, next) => {
    if(err && err.code === 'EBADCSRFTOKEN') {
      res.render('404');
      return;
    }
    next();
  };
  
  exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  };

  exports.loginRequired = (req, res, next) => {
    if(!req.session.user){
      req.flash('errors', 'Você precisa fazer Login.');
      req.session.save(()=> res.redirect('/'));
      return;
    }

    next();
  };