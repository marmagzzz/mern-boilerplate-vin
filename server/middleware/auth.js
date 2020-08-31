const { User } = require('../models/User');

const moment = require('moment');

let auth = (req, res, next) => {
  let token = req.cookies.w_auth;

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    const DATE_TIME_FORMAT = 'MM-DD-YYYY HH:mm:ss';

    if (!user)
      return res.json({
        isAuth: false,
        error: true,
        message : "Token invalid"
      });
    else {
      // user.tokenExp // UNIX Timestamp
      
      let isTokenExpired = moment(moment().format(DATE_TIME_FORMAT)).isAfter(moment(user.tokenExp, 'x').format(DATE_TIME_FORMAT));
      if ( isTokenExpired ) {
        return res.json({
          isAuth: false,
          error: true,
          message : "Token expired"
        });
      }
      else {
        req.token = token;
        req.user = user;
      }
    }
    next();
  });
};

module.exports = { auth };
