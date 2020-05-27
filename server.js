const express = require("express");
const {
    connect
} = require("mongoose");
const cors = require("cors");
const {
    success,
    error
} = require("consola");
const {
    DB,
    PORT
} = require("./Config");
const Handlebars = require("handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const exphbs = require("express-handlebars");
const passport = require('passport');
const bodyParser = require("body-parser");
const methodOverride = require("method-override");


// init app
const app = express();

//import user routes
const auth = require("./Routes/Uber")

// connecting database
let port = process.env.PORT || 6335;
const StartApp = async () => {
    try {
        await connect(DB, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        success({
            message: `successfully connected to the DATABASE => ${DB}`,
            badge: true
        });
        app.listen(PORT, (err) => {
            if (err) {
                error({
                    message: err,
                    badge: true
                });
            } else {
                success({
                    message: `APP is running on port => ${PORT}`,
                    badge: true
                })
            }
        })
    } catch (err) {
        error({
            message: `unable to connect to mongoDB`,
            badge: true
        })
    }
};
StartApp();

//midelwares
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// express handlebars middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//static files will be here middleware
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));

//express session
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
}));
//load passport modules
require('./config/passport')(passport)

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// set global vars to access any where in the project
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.errors_msg = req.flash('errors_msg');
    res.locals.error = req.flash('errors');
    res.locals.user = req.user || null;
    next();
})

//home route
app.get('/', (req, res) => {
    res.render('home.handlebars');
});

//use app level middleware app.use
app.use("/auth", auth);

//page not found route
app.get('**', (req, res) => {
    res.render('pagenotfound.handlebars');
});