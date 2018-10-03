var express = require('express');
global.reqlib = require('app-root-path').require;
var bodyParser = require('body-parser');


require('dotenv').config();
global.config = require('config');
var environment = process.env.NODE_ENV;

var app = express();

const port = config.get('App.webServer.port');

// var config = require('./config/config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const dbManager = require('./db/DBManager');
// dbManager(dbUrl);
dbManager.connect();
    // .then().catch();


console.log('init....');
// console.log('DB_HOST: ' + process.env.DB_HOST);
// console.log('DB_USER: ' + process.env.DB_USER);
// console.log('DB_PASS: ' + process.env.DB_PASS);
console.log('environment: ' + environment);
console.log('port: ' + port);


const middleware = require('./middleware/middleware') (app);
const routes = require('./routes/router') (app);
// routers(app);








var server = app.listen(port, () => {
    console.log("app running on port: ", server.address().port);
});

// module.exports = app;