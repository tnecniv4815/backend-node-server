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
            let carouselLength = 3;

            console.log('req_page_no: ' + req_page_no);
            console.log('req_item_per_page: ' + req_item_per_page);

            console.log('sizePerPage: ' + sizePerPage);
            console.log('pageNum: ' + pageNum);

            let articles;


            Article
                .find({}, '_id title thumbnail posted_at')
                .limit(sizePerPage + carouselLength)
                .skip(sizePerPage * pageNum + carouselLength)
                .sort({'posted_at': -1})
                // .populate( 'contents', '-_id type subtitle media_url content')
                .then((result) => {
                    // console.log(result);
                    console.log(result.length);



                    let responseModel = {};

                    if (result.length >= carouselLength) {
                        const tmpCarouseList = _.slice(result, 0, carouselLength);
                        const tmpList = _.slice(result, carouselLength, result.length);

                        responseModel = {
                            carousel: tmpCarouseList,
                            list: tmpList
                        };

                    } else {
                        responseModel = {
                            carousel: result,
                            list: []
                        };
                    }

                    res.send(responseModel)
                })
            ;


        } catch (e) {
            return res.status(500).send(e);
        }




    },

    articleDetailById : (req, res, next) => {

        const req_article_id = req.body.article_id;
        console.log('article_id: ' + req_article_id);

        // ObjectId("5bc99072606d563e9f5a965c")

        // if (_.isNil(req_article_id)) {
        //     res.status(500).send("No article id");
        // } else {
        //
        // }

        try {

            Article
                .findOne({ _id: req_article_id })
                // .findOne({ _id: id }, '_id title thumbnail posted_at')
                .populate( 'contents', '-_id type subtitle media_url content')
                .then((result) => {
                    // console.log(result);
                    console.log(result);

                    let responseModel = {};

                    if (!_.isNil(result)) {
                        responseModel = result;
                    }

                    res.send(responseModel)
                })
            ;

        } catch (e) {
            return res.status(500).send(e);
        }

        // res.send('123123 Audi Q7, BMW X5, Mercedes GL');



        // ObjectId("5bcd74af606d566cb74636eb")




    },


    //



};