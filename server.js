const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const routes = require('./routes');

const app = express();

app.use(session({
    secret: "senhaSecreta",
    cookie: { maxAge: 300000000000000000 }
}));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(express());
app.use(routes);

app.listen(3333);
