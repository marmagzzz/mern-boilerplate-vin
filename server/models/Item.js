const mongoose = require('mongoose');
const objectIdType = require('mongoose').Types.ObjectId;

// Inquiry schema
const { inquirySchema } = require('./Inquiry');

const itemSchema = mongoose.Schema({
    _id : objectIdType,
    item_name : {
        type : String,
        require : true,
        maxlength : 100
    },
    item_price : {
        type : Number,
        require : true,
        default : 0,
        maxlength : 12
    },
    posted_by : {
        type : objectIdType,
        ref : 'User'
    },
    is_sold : {
        type : Boolean,
        default : false
    },
    date_listed : {
        type : Date,
        default : Date.now
    },
    last_updated : {
        type : Date,
    },
    inquiries : [
        inquirySchema
    ]
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;