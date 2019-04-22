const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/recipejot-dev', {
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));



// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
 }));

 // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    // calls the next piece of middleware
    next();
});

// How middleware works
// app.use(function(req, res, next){
//     // console.log(Date.now())
//     req.name = 'Chris Nathan';
//     next();
// });

// Index route
app.get('/', (req, res) => {
    const title = 'Welcome to RecipeBox'
    res.render('INDEX', {
        title: title
    });
});

// About route
app.get('/about', (req, res) => {
    res.render('About');
})

// Use routes
app.use('/ideas', ideas)
app.use('/users', users)

const port = 5000;

app.listen(port, () => {
    // ES6 way of saying things
    console.log(`Server started on port ${port}`);
});

