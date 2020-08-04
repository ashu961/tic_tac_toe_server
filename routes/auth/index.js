const passport = require('passport');
const jwt = require('jsonwebtoken');

  module.exports=app=>{
    app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile','email'] }));

    app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        let token = jwt.sign({
          data: req.user
          }, 'secret_token'); // expiry in seconds
        res.cookie('jwt', token)
        res.redirect('http://localhost:3000');
    });

    app.get('/auth/me',passport.authenticate('jwt', { session: false }),(req,res)=>{
      res.json(req.user.userDetails);
    })

  };