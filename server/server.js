const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/** .env */
require('dotenv').config();

/** CORS CONFIG */
const CORS = require('./CORS');

/** SERVER CONFIG */
const config = require("./config/key"),
  MONGO_URI = config.mongoURI,
  SERVER_PORT = config.SERVER_PORT;

/** DB CONNECT */

  const mongooseConnection = mongoose.connect(MONGO_URI,
    {
      useNewUrlParser: true, useUnifiedTopology: true,
      useCreateIndex: true, useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

/** END OF DB CONNECT */

/** PASSPORT CONFIG */
  require('./middleware/passport')(passport);
/** END OF PASSPORT CONFIG */

/** SERVER CONFIGS */
  const app = express();
  
  /** Cors middleware */
  app.use(CORS);
  
  /** Cookies middleware */
  app.use(cookieParser('secret'));

  //to not get any deprecation warning or error
  //support parsing of application/x-www-form-urlencoded post data
  app.use(bodyParser.urlencoded({ extended: true }));
  //to get json data
  // support parsing of application/json type post data
  app.use(bodyParser.json());

//   // Express session
  app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true,
    store : new MongoStore({ mongooseConnection : mongoose.connection })
  }));

//   // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

/** END OF SERVER CONFIGS */



//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
// app.use('/uploads', express.static('uploads'));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

  // Set static folder   
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

}


/** ROUTE REGISTRATION */

    /** USER ROUTES */
    const UsersRoutes = require('./routes/api/users');
    app.use('/api/users', UsersRoutes);

    /** NOTE : ALWAYS PUT THIS ROUTE AS THE LAST ROUTE */
    /** THIS IS A FRONT END ROUTE */

    /** INDEX ROUTE */
    const IndexRoute = require('./routes/index');
    app.use('*', IndexRoute);

/** END OF ROUTE REGISTRATION */

/** START LISTEN TO PORT */
app.listen(SERVER_PORT, () => {
  console.log(`Server Listening on ${SERVER_PORT}`);
});