const express = require('express');
const router = express.Router();
const passport = require('passport');
const moment = require('moment');
const axios = require('axios');

const { User } = require("../../models/User");

// const { auth } = require("../../middleware/auth");

//=================================
//             User
//=================================

// @route GET /api/users/auth
// @desc Get auth of user
// @access User
router.get("/auth", (req, res, next) => {
// router.get("/auth", auth, (req, res) => {
    passport.authenticate('jwt', { session : false },
        (err, user, info) => {
            if ( err ) return next(err);
        
            if ( !user ) return res.send({ isAuth : false, error : true, message : 'No authorized user found or token invalid' });
    
            const DATE_TIME_NOW = moment(new Date(), 'MM-DD-YYYY'),
                TOKEN_EXPIRATION = moment(user.tokenExp, 'x');

            let isTokenExpired = moment(DATE_TIME_NOW).isAfter(TOKEN_EXPIRATION);

            if ( isTokenExpired ) {

              return res.json({
                isAuth: false,
                error: true,
                message : "Token expired"
              });

            }
            else {
                // axios.get('http://174.138.21.223:8069/leads/get-leads/53')
                // .then((response) => {
                //     req.token = user.token;
                //     req.user = user;
                //     res.status(200).json({
                //         leads: response.data.leads,
                //         _id: req.user._id,
                //         isAdmin: req.user.role === 0 ? false : true,
                //         isAuth: true,
                //         email: req.user.email,
                //         name: req.user.name,
                //         lastname: req.user.lastname,
                //         role: req.user.role,
                //         image: req.user.image,
                //     });
                // })
                // .catch( err => {
                //     res.status(400).json({
                //         isAuth : false,
                //         error : true,
                //         message : err,
                //     });
                // });

                req.token = user.token;
                req.user = {
                    _id : user._id,
                    name : user.name,
                    email : user.email,
                    lastname : user.lastname,
                };

                res.status(200).json({
                    _id: req.user._id,
                    isAdmin: req.user.role === 0 ? false : true,
                    isAuth: true,
                    email: req.user.email,
                    name: req.user.name,
                    lastname: req.user.lastname,
                    role: req.user.role,
                    image: req.user.image,
                });
            }
        }
    )(req, res, next);

});

router.post("/register", (req, res) => {

    console.log('Reqbody', req.body)
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res, next) => {

    passport.authenticate('local', {session : false}, (err, user, info) => {
        if ( err ) return next(err);
        
        if ( !user ) return res.send({ loginSuccess : false, message : 'Invalid credentials' });

        User.findById(user._id)
            .then( user => {
                user.generateToken((err, user) => {
                    // Something went wrong while generating token
                    if (err) return res.status(400).send(err);
                    // Return succeed login with token
                    res.cookie("w_authExp", user.tokenExp, { httpOnly : true, sameSite : true })
                    .cookie("w_auth", user.token, { httpOnly : true, sameSite : true })
                    .status(200)
                    .json({
                        loginSuccess : true,
                        user : {
                            email : user.email,
                            userId : user._id,
                            name : user.name
                        }
                    });
                });
            })
            .catch( err => {
                return res.send({
                    loginSuccess : false,
                    message : "Something went wrong. Please try again.",
                    error : err
                });
            });

    })(req, res, next);

    // User.findOne({ email: req.body.email }, (err, user) => {
    //     if (!user)
    //         return res.json({
    //             loginSuccess: false,
    //             message: "Auth failed, email not found"
    //         });

    //     user.comparePassword(req.body.password, (err, isMatch) => {
    //         // Check if error
    //         if ( err ) {
    //             return res.send({
    //                 status : "fail",
    //                 message : "Something went wrong. Please try again.",
    //                 error : err
    //             });
    //         }
    //         // Check if match
    //         if (!isMatch) return res.json({ loginSuccess: false, message: "Wrong password" });

    //         // Proceed if has match
    //         else 
    //         user.generateToken((err, user) => {
    //             // Something went wrong while generating token
    //             if (err) return res.status(400).send(err);
    //             // Return succeed login with token
    //             res.cookie("w_authExp", user.tokenExp)
    //                 .cookie("w_auth", user.token)
    //                 .status(200)
    //                 .json({
    //                     loginSuccess: true, userId: user._id
    //                 });
    //         });
    //     });
    // });
});

router.get("/logout", passport.authenticate('jwt', {session : false}), (req, res) => {
// router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        res.clearCookie('w_auth')
            .clearCookie('w_authExp');
        return res.status(200).send({
            success: true,
            user : {
                email : "",
                name : ""
            }
        });
    });
});

// @route GET /api/users/get-users
// @desc Get all users
// @access Admin
router.get("/getallusers", passport.authenticate('jwt', {session : false}), (req, res) => {
// router.get("/getallusers", auth, (req, res) => {
    const { _id } = req.user;
    User.findOne({ _id : _id, role : 1 })
        .then((user) => {
            
            if ( !user ) {
                res.send({
                    status : "fail",
                    user,
                    message : "User does not exist or not an admin"
                });
            }
            else {
                User.find({ 
                    _id : {
                        $ne : _id
                    } 
                })
                .then( users => {
                    res.send({
                        userId : _id,
                        users : users
                    });
                });
            }
        });
});

module.exports = router;
