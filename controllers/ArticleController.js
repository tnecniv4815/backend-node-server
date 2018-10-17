// const mongoose = require('mongoose');
const Article = require('./../schema/Article');
const ArticleContent = require('./../schema/ArticleContent');
const User = require('./../schema/User');

module.exports = {
    articleDetail : (req, res, next) => {
        res.send('articleDetail');
    },

    list : async (req, res, next) => {
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


        // ArticleContent.find({}).then((result) => {
        //     console.log(result);
        //     res.send(result)
        // });



        // ObjectId("5bc3f213606d566686275fa0")

        // Article.find({}).then((users) => {
        //     console.log(users);
        // });


        // User.find({}).then((err, list) => {
        //     console.log(list);
        //     res.send(list);
        // });



        // res.send('article list');



        try {
            const req_page_no = req.body.page;
            const req_item_per_page = req.body.limit;

            // let sizePerPage = 4;
            // let pageNum = Math.abs(req.body.page);   // Math.abs(req.query.limit)

            let sizePerPage = req_item_per_page;
            let pageNum = req_page_no;

            console.log('req_page_no: ' + req_page_no);
            console.log('req_item_per_page: ' + req_item_per_page);

            console.log('sizePerPage: ' + sizePerPage);
            console.log('pageNum: ' + pageNum);

            let articles;

            Article.find()
                .limit(sizePerPage)
                .skip(sizePerPage * pageNum)
                .sort({'posted_at': -1})
                .populate([{path: 'contents', model: 'ArticleContent'}])
                .then((result) => {
                    console.log(result);
                    res.send(result)
                })
            ;


        } catch (e) {
            return res.status(500).send(e);
        }




    },

    articleDetailById : (req, res, next) => {

        const id = req.params.id;

        console.log('id: ' + id);

        res.send('123123 Audi Q7, BMW X5, Mercedes GL');
    },


    //



};