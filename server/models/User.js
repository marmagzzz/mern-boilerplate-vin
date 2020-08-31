const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const JWT = require('jsonwebtoken');
const TOKEN_SIGN = process.env.TOKEN_SIGN || 'secret';
const { signToken } = require('../utils');

const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    email: {
        type:String,
        trim:true,
        unique: 1,
        require : true,
    },
    password: {
        type: String,
        minglength: 5,
        require : true,
    },
    lastname: {
        type:String,
        maxlength: 50,
        require : true,
    },
    contact_number : {
        type : String,
        require : true,
    },
    role : {
        type:Number,
        default: 0 
    },
    image: String,
    created_date : {
        type : Date,
        default : Date.now
    },
    token : {
        type: String,
    },
    tokenExp :{
        type: Number
    },
    mobileToken : {
        type: String,
    },
    mobileTokenExp :{
        type: Number
    }
});


userSchema.pre('save', function( next ) {
    var user = this;
    
    if(user.isModified('password')){    
        // console.log('password changed')
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash 
                next()
            })
        })
    } else {
        next()
    }
});

userSchema.methods.comparePassword = function(plainPassword,cb){
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        // Something went wrong while comparing password
        if (err) return cb(err, false);
        // Proceed comparing
        // Password is not match
        if ( !isMatch )
            return cb(null, isMatch);
        // Password is match
        return cb(null, this);
    });
};

userSchema.methods.generateToken = function(cb) {
    let user = this;
    // console.log('user',user);
    // console.log('userSchema', userSchema);
    let { token, tokenExp } = signToken(user._id.toHexString());
    
    // Moved to utils/index.js for more reusability
    // var token =  JWT.sign(user._id.toHexString(), TOKEN_SIGN);
    // var tokenExp = moment().add(1, 'hour').valueOf();

    /** Update user's token */
    user.tokenExp = tokenExp;
    user.token = token;

    user.save(function (err, user){
        if(err) return cb(err)
        cb(null, user);
    });
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    console.log(token)
    JWT.verify(token,TOKEN_SIGN,function(err, decode){
        user.findOne({"_id":decode, "token":token}, function(err, user){
            console.log(user);
            if(err) return cb(err);
            cb(null, user);
        });
    });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };