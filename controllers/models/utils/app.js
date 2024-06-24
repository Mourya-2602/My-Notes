if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Product = require('./models/product');
const {isLoggedIn}=require('./middleware');


const userRoutes = require('./routes/users');


const dbUrl = process.env.MONGODB_URI
// process.env.DB_URL

// 'mongodb://127.0.0.1:27017/STUDENTS'
mongoose.connect(dbUrl)
.then(()=>{console.log("Mongoose Connection open!!!")})
.catch(err=>{
    console.log('Oh No!! mongoose connection error!!');
    console.log(err)
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(__dirname + '/public/'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);



app.get('/', (req, res) => {
    res.render('home')
});

app.get('/products',isLoggedIn, async (req, res) => {

    try {
        const userId = req.user._id;
        const products = await Product.find({ userId: userId }).exec();
        res.render('products/index', { products: products, user: req.user });
      } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred');
      }

    // const { title } = req.query;
    // if (title) {
    //     const userId = req.user._id;
    //     const products = await Product.find( { title })
    //     res.render('products/index', { products, title })
    // } else {
    //     const products = await Product.find({})
    //     res.render('products/index', { products })
    // }
});

app.get('/products/new',isLoggedIn, (req, res) => {
    const userId = req.user._id;
    res.render('products/new', { user: req.user });
});

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
});

app.get('/products/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/show', { product })
});

app.get('/products/:id/edit',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product });
});

app.put('/products/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`);
});

app.delete('/products/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
});






app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})


