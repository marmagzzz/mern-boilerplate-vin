const mongoose = require('mongoose');
const objectIdType = require('mongoose').Types.ObjectId;

const inquirySchema = mongoose.Schema({
    inquiry_by : {
        type : objectIdType,
        ref : 'User'
    },
    inquiry_body : {
        type : String,
        maxlength : 300
    },
    inquiry_date : {
        type : Date,
        default : Date.now
    }
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = {
    Inquiry,
    inquirySchema
};