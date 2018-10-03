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




module.exports = (router) => {

    // router.use('', (req, res, next) => {
    //     next();
    // });

    router.get('/list', (req, res, next) => {
       res.send('article list');
    });

};