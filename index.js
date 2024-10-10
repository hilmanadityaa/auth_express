const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const PORT = 8000;

// connect to mongodb
mongoose.connect('mongodb://127.0.0.1/auth_demo').then((result) => {
    console.log('connected to mongodb');
}).catch((err) => {
    console.log(err);

});

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(session({
    secret: 'goodday-coolin',
    resave: false,
    saveUninitialized: true
}));

app.use('/', require('./routes/users'));

app.listen(PORT, () => {
    console.log(`app listening on port http://localhost:${PORT}`);

});