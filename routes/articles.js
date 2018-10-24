const ArticleController = require('./../controllers/ArticleController');


const ArticleContent = require('./../schema/ArticleContent');

// var express = require('express');
// var router = express.Router();
//
// //
//
// module.exports = router;



// module.exports = (app, router) => {
//
//     const articleController = require('./../controllers/ArticleController');
//
//     // router.get('/detail', articleController.articleDetail);
//     // router.get('/list', articleController.list);
//     // router.get('/:id', articleController.articleDetailById);
//
//
//
//     // router.get('/list', function(req, res) {
//     //     res.send('article list')
//     // });
//     //
//     //
//     // router.get('/:id', function(req, res) {
//     //     res.send('Audi Q7, BMW X5, Mercedes GL')
//     // });
// };




module.exports = (app, router) => {

    router.use('/article', (req, res, next) => {
        console.log('article_route_middleware');
        next();
    });

    // router.get('/list', (req, res, next) => {
    //    res.send('article list');
    // });

    router.post('/article/list', ArticleController.list);
    router.post('/article/detail', ArticleController.articleDetailById);

    router.post('/article/', (req, res, next) => {
        console.log('hahaha');
        console.log(req.body);

        res.send('asdf');
    });

/*
    router.get('/list', (req, res, next) => {
        console.log('lalala');

        const Article = require('./../schema/Article');

        // Article.find({}).then((result) => {
        //     console.log('ggg');
        //     console.log(result);
        //
        //     res.send(result);
        // });

        ArticleContent.find({}).then((result) => {
            console.log('hhh');
            console.log(result);

            res.send(result);
        });


    });
    */


};