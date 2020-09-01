const express = require('express');
const router = express.Router();
const passport = require('passport');
const moment = require('moment');

const Item = require('../../models/Item');
const Inquiry = require('../../models/Inquiry');


/** 
 *      ITEMS
 */

 // @route GET /api/items/:itemId
 // @desc Get specific item using _id of item
 // @access User
 router.get('/:itemId', passport.authenticate('jwt', {session : false}), (req, res, next) => {

    const { itemId } = req.params;
    console.log('test', itemId);
    if ( itemId ) {
        Item.findById(itemId)
            .then( item => {
                res.status(200)
                    .json({
                        success : true,
                        message : "ok",
                        item : item
                    });
            })
            .catch( err => {
                res.status(200).send({
                    success : false,
                    message : "Item not found",
                    error : err
                });
            });
    }
    else {
        res.status(401).json({
            success : false,
            message : "Invalid parameter"
        });
    }

 });

module.exports = router;