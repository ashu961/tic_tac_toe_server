const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");

passport.serializeUser((user, done) => {
    done(null, user.id);
  });

passport.deserializeUser((id, done) => {
User.findById(id).then(user => {
    done(null, user);
});
});

passport.use(new GoogleStrategy({
    clientID: '1007613666524-r73sg2bonfnd652j4oi04n19k9iq1hnq.apps.googleusercontent.com',
    clientSecret: 's7qroKESl4am1qZbr8JRX7XN',
    callbackURL: "http://localhost:3001/auth/google/callback",
    proxy:true
  },
  async (accessToken, refreshToken, profile, done) => {
    // console.log(accessToken);
    const existinguser = await User.findOne({ googleID: profile.id });
    if (existinguser) {
      return done(null, existinguser);
    }
    const user = await new User({ googleID: profile.id, userDetails : profile._json }).save();
    done(null, user);
  }
));

// var opts = {}
// opts.jwtFromRequest = function(req) { // tell passport to read JWT from cookies
//     var token = null;
//     if (req && req.cookies){
//         token = req.cookies['jwt']
//     }
//     return token
// }
// opts.secretOrKey = 'secret'

// main authentication, our app will rely on it

  passport.use(new JwtStrategy({
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'secret_token'
}, function(jwt_payload, done) {
    return done(null, jwt_payload.data)
    // if (CheckUser(jwt_payload.data)) {
    //     return done(null, jwt_payload.data)
    // } else {
    //     // user account doesnt exists in the DATA
    //     return done(null, false)
    // }
}))

