const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { User } = require('../models/User');
const TOKEN_SIGN = process.env.TOKEN_SIGN || 'secret';

const cookieExtractor = req => {
    let token = null;
    let tokenExp = null;
    if ( req && req.cookies ) {
        // Get the stored tokens
        token = req.cookies.w_auth;
        tokenExp = req.cookies.w_authExp;
    }
    return token;
};

module.exports = function(passport) {

    // Use for authorization
    passport.use(new JwtStrategy({
            jwtFromRequest : cookieExtractor,
            secretOrKey : TOKEN_SIGN
        }, (payload, done) => {
            // console.log('PAYLOAD SUB ID', payload);
            User.findById({ _id : payload.sub }, ( err, user ) => {
                // Error occured
                if (err){
                    // console.log('Error occured');
                    return done(err, false);
                }
                // User found
                if (user) {
                    // console.log('User found');
                    return done(null, user);
                }
                // No user found
                else {
                    // console.log('No user found');
                    return done(null, false);
                }
            });
        }
    ));
    
    // Use for authentication local strategy using email and pass
    passport.use(new LocalStrategy({usernameField : "email", passwordField : "password" },(email, password, done) => {
        User.findOne({ email }, (err, user) => {
            // Something wrong with db
            if ( err )
                return done(err);
            // User not exist
            if (!user)
                return done(null, false);
            // User exists and check if password is correct
            return user.comparePassword(password, done);
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

};