/*
 The app.js file initializes our server which is an API that can be used to interact with our backend MongoDB instance.
 */

//import modules
require('dotenv').config();
const express = require("express"); //server-side development, node.js framework

const mongoose   = require("mongoose"); //database
const MongoStore = require('connect-mongo'); //saving authenticated sessions in mongoDB in case the server temporarily goes down
const bodyparser = require("body-parser"); //forms

const cors = require("cors"); //CRUD operations: allow POST operations
const path = require("path"); //all of our routing
const cookieParser = require('cookie-parser');

//authentication
const session = require("express-session")
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose'); //handles hashing and salting for us... Uses something as effective as bcrypt. 
const User = require('./models/user');


const app = express(); //server object 

//add bodyparser for forms
app.use(bodyparser.json());


app.use(bodyparser.urlencoded({extended: true}));

//we need to use cookies
app.use(cookieParser());

const route = require("./route/route.js"); //our routing directory. The 'require' keyword gets the file instead of a string
const router = require('./route/route.js');



//port for backend API
const port = 3000;

//adding middleware: for POST requests
app.use(cors({
    origin:['http://localhost:4200', 'http://127.0.0.1:4200'],
    credentials: true
}));

//exposes a directory or file to URL so it's contents can be publicly accessed
app.use(express.static(path.join(__dirname, "public")));
//__dirname is an environment variable and just gets the working absolute directory for this file. 


/*Connects to the sensorData database (automatically created if not already existing)
 To use a specific collection, look at the sensorData and sensorReading files in the models folder.
 The first argument of the module.export is the collection used for that schema.  */

//mongoose.connect('mongodb://user:pass@localhost:port/database');
const mongoUrl = "mongodb://localhost:27017/sensorData";
mongoose.connect(mongoUrl);
mongoose.connection.on("connected", function ()
{
    console.log("Connected to mongoDB database @ port 27017");
});
mongoose.connection.on("error", function (err)
{
    if (err)
    {
        console.log("Error in database: " + err);
    }
});

//authentication
app.use(session({
    secret: process.env.SESSIONSECRET, //the key needed for encrypting the cookie
    resave: false, //stops unmodified sessions from being saved into the session store
    saveUninitialized: false,  //forces unmodified, not changed sessions to be discarded
    cookie: {
        maxAge: 360000,
        httpOnly: false,
        secure: false
    },
    store: new MongoStore({mongoUrl: mongoUrl}) //uses a mongoose connection to save session objects. Deletes sessions when logging off.
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy()); //using passportLocalMongoose
passport.serializeUser(function(user, done){ //creating a session ID for a new user
    done(null, user.id);
})
passport.deserializeUser(function (id, done){
    User.findById(id, function(err, user){ //allows us to unpack information about a user
        done(null, user);
    })
})

//routes
app.use("/api", route); //the "/api" directory will be how we access our backend.
app.post("/register", function(req, res){ //using our passportLocalMongoose package to handle 
    User.register({
        username: req.body.username //the parameters of the register function must look exactly like this for the function to work... 
    }, req.body.password, function(err, user){
        if(err){
            res.status(400).json({
                msg: "err",
                isAuth: req.isAuthenticated()
            });
        } else {
            passport.authenticate("local")(req, res, function(){
                res.cookie('user_ID', req.user._id.toString(), {maxAge: 360000, httpOnly: true})
                res.status(200).json({
                    msg: "registered",
                    isAuth: req.isAuthenticated()
                });
            })
        }
    })
})

app.post("/login", function(req, res){
    const user = new User({
        user:req.body.username,
        password:req.body.password
    });
    req.login(user, function(err){
        if(err){
            res.status(400).json({ 
                msg: "err",
                isAuth: req.isAuthenticated()
            });
        } else {
            passport.authenticate("local")(req, res, function(){
                res.cookie('user_ID', req.user._id.toString())
                res.status(200).json({
                    msg: "logged in",
                    isAuth: req.isAuthenticated()
                });
            })
        }
    })
});

app.delete("/logout", function(req, res){
    req.logout();
    res.clearCookie('user_ID');
    res.clearCookie('connect.sid');
    return res.status(200).json({
        msg: "logout",
        isAuth: req.isAuthenticated()
    });
});

//use this route to constantly check whether a user is actually authenticated to go to a route on the Angular app
// or whether they should be on a specific page. 
app.get("/user", isValidUser, function(req, res, next){ //uses middleware function 'isValidUser' to verify authenticity.
    //we won't be able to access the route if 'isValidUser' returns an error... If it doesn't, then...
    return res.status(200).json(req.user); //deserialize function
})

function isValidUser(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        return res.status(401).json({msg: "err"})
    }
}

//our home page for the API

//Listen on what port, what do we print out when we confirm we're listening?
app.listen(port, function ()
{
    console.log("Server started at port: " + port);
});