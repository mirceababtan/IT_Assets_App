const express = require('express');
const config = require('./config.json');
const router = require('./controllers/router');
const cookieParser =  require('cookie-parser');
const session = require('./controllers/session');

const app = express();

app.use(express.static('./views/static'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(session.sessionMiddleware);

app.use('/', router);

app.listen(config.port, ()=> console.log(`App listening on port ${config.port}!`));