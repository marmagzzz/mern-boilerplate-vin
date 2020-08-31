const JWT = require('jsonwebtoken');
const moment = require('moment');
const TOKEN_SIGN = process.env.TOKEN_SIGN || 'secret';

module.exports = {

    signToken : function(userId) {
        let token =  JWT.sign({
            iss : "Marmagz",
            sub : userId,
        }, TOKEN_SIGN, { expiresIn : "1h" }),
            tokenExp = moment().add(1, 'hour').valueOf();
        return { token, tokenExp };
    },

};