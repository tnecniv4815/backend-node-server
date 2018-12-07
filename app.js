const express = require('express');
global.reqlib = require('app-root-path').require;
global._ = require('lodash');
const bodyParser = require('body-parser');
global.path = require('path');
const AWS = require('aws-sdk');
global.AWSManager = require('./db/AWSManager');
global.Util = require('./Util/Util');
global.moment = require('moment');
global.request = require('request');
global.fs = require('fs');

require('dotenv').config();
global.config = require('config');
global.Const = require('./Util/Const');
var environment = process.env.NODE_ENV;

global.imageDestPath = process.env.IMAGE_FILE_DEST_PATH;

global.AWSConfig = {
    region : process.env.AWS_REGION,
    bucketName_Article : process.env.AWS_BUCKET_NAME,
    s3Articles : process.env.AWS_S3_FOLDER_ARTICLE,
    s3ArticleLinks : process.env.AWS_S3_FOLDER_ARTICLE_LINK,
    s3ArticleDetail : process.env.AWS_S3_FOLDER_ARTICLE_DETAIL,
    s3Media : process.env.AWS_S3_FOLDER_MEDIA,
    ddbTableNameArticle : process.env.AWS_DDB_TABLE_NAME_ARTICLE,
    ddbTableNameArticleDetail : process.env.AWS_DDB_TABLE_NAME_ARTICLE_DETAIL,
};

// AWS setup
global.ddb = new AWS.DynamoDB({
    region: AWSConfig.region
});
global.docClient = new AWS.DynamoDB.DocumentClient({
    region: AWSConfig.region
});

global.s3 = new AWS.S3();



var app = express();

const port = config.get('App.webServer.port');

// const awsLongPolling = require('./aws/aws-long-polling');
// awsLongPolling.start();

// var config = require('./config/config');



// console.log(__dirname);

global.rootPath = __dirname;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// const statisResource = '/Users/vincent/repository/github/web-crawler/public/images';
// app.use('/public', express.static(path.join(statisResource, '/../public')));

// /Users/vincent/repository/github/backend-node-server/
// app.use('/public', express.static('/Users/vincent/repository/github/web-crawler'));


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