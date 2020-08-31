const CORS = require('cors');

const allowedOrigins = ['https://bentamonatol.herokuapp.com, http://127.0.0.1:8000, http://localhost:8000', 'http://localhost:5000', 'http://127.0.0.1:5000', 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:*', 'http://127.0.0.1:*'];

module.exports = CORS({
    origin: function(origin, callback){
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        
        console.log('Origin: ', origin);

        if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' +
                        'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
});