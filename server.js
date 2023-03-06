require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const path = require('path');
const {checkCsrfError, csrfMiddleware, middlewareGlobal} = require('./src/middlewares/middleware');
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true})
    // .then(() => console.log('Agora que a conexão ocorreu.'));
    .then(() => {
        console.log('Agora que a conexão ocorreu.');
        app.emit('pronto');
    })
    .catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const helmet = require('helmet');
const csrf = require('csurf');

const sessionOptions = session({
    secret: 'asdfasfdasdfasfasfdasdfasf1231',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());
app.use(helmet());

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(csrf());
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(middlewareGlobal);

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(routes);

app.listen(3000, () => {
    console.log('Aessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
});

//