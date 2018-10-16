// const mongoose = require('mongoose');
const Article = require('./../schema/Article');
const ArticleContent = require('./../schema/ArticleContent');
const User = require('./../schema/User');

module.exports = {
    articleDetail : (req, res, next) => {
        res.send('articleDetail');
    },

    list : (req, res, next) => {
        console.log('get_article_list');


        // mongoose.model('article')
        //     .find()
        //     .exec((err, result) => {
        //         console.log('hahaha');
        //         console.log(result);
        //     })
        // ;

        // const results = Article.find().exec;
        // console.log(results);

        // Article.findByTitle('促通過香港人權民主法 示威者通宵靜坐後向美領館交請願信', (cb) => {
        //     console.log(cb);
        //     res.send(cb);
        // });

        // Article.find({title: '促通過香港人權民主法 示威者通宵靜坐後向美領館交請願信'}, (err, results) => {
        //     console.log(results);
        //     res.send(results);
        // });

        ArticleContent.find({type: 1}).then((result) => {
            console.log(result);
            res.send(result)
        });



        // ObjectId("5bc3f213606d566686275fa0")

        // Article.find({}).then((users) => {
        //     console.log(users);
        // });


        // User.find({}).then((err, list) => {
        //     console.log(list);
        //     res.send(list);
        // });



        // res.send('article list');
    },

    articleDetailById : (req, res, next) => {

        const id = req.params.id;

        console.log('id: ' + id);

        res.send('123123 Audi Q7, BMW X5, Mercedes GL');
    },

};