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
            const req_start_date_time = req.body.startDateTime;
            const req_end_date_time = req.body.endDateTime;

            // let sizePerPage = 4;
            // let pageNum = Math.abs(req.body.page);   // Math.abs(req.query.limit)

            let sizePerPage = req_item_per_page;
            let pageNum = req_page_no;
            let carouselLength = 0;

            console.log('req_page_no: ' + req_page_no);
            console.log('req_item_per_page: ' + req_item_per_page);

            console.log('sizePerPage: ' + sizePerPage);
            console.log('pageNum: ' + pageNum);

            console.log(`req_start_date_time: ${req_start_date_time} , req_end_date_time: ${req_end_date_time}`);




            let articles = [];

            const articleId = '3f20458f76c786edfca5b398f905e174';

            // const params = {
            //     TableName : AWSConfig.ddbTableNameArticle,
            //     KeyConditionExpression: "articleId = :_id",
            //     ProjectionExpression: "created_at, title",
            //     ExpressionAttributeValues: {
            //         ":_id": articleId,
            //     }
            // };

            const startDate = '';

            // const params = {
            //     TableName : AWSConfig.ddbTableNameArticle,
            //     IndexName : 'articleIdIndex',
            //     ProjectionExpression: "created_at, title",
            //     KeyConditionExpression: '#createdDateTime BETWEEN :fromDateTime AND :toDateTime ',
            //
            //
            //     // KeyConditionExpression: "#yr = :yyyy",
            //     // // FilterExpression: "#create between :start_yr and :end_yr",
            //     ExpressionAttributeNames: {
            //         "#createdDateTime": "created_at",
            //     },
            //     ExpressionAttributeValues: {
            //         // ":_id": articleId,
            //         ":fromDateTime": '2017-02-20T01:58:49.710Z',
            //         ":toDateTime": '2019-02-20T01:58:49.710Z',
            //         // ":start_yr": 2018,
            //         // ":end_yr": 2018,
            //     }
            // };
            //
            // docClient.query(params, function(err, data) {
            //     if (err) {
            //         console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            //     } else {
            //         console.log("Query succeeded.");
            //         data.Items.forEach(function(item) {
            //             console.log(" -", item.title + ": " + item.created_at);
            //         });
            //     }
            // });

/*
            const params = {
                TableName: AWSConfig.ddbTableNameArticle,
                ProjectionExpression: "created_at, title",
                FilterExpression: "#createdDateTime between :fromDateTime and :toDateTime",
                ExpressionAttributeNames: {
                    "#createdDateTime": "created_at",
                },
                ExpressionAttributeValues: {
                    ":fromDateTime": '2018-11-04T01:58:49.710Z',
                    ":toDateTime": '2018-12-04T01:58:49.710Z'
                }
            };


            docClient.scan(params, (err, data) => {
                if (err) {
                    console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    // print all the movies
                    console.log(`data: ${ JSON.stringify(data) }`);
                    console.log(`Scan succeeded. size: ${data.Items.length}`);
                    data.Items.forEach(function(movie) {
                        console.log(movie.created_at + ": ", movie.title);
                    });

                    // continue scanning if we have more movies, because
                    // scan can retrieve a maximum of 1MB of data
                    // if (typeof data.LastEvaluatedKey != "undefined") {
                    //     console.log("Scanning for more...");
                    //     params.ExclusiveStartKey = data.LastEvaluatedKey;
                    //     docClient.scan(params, onScan);
                    // }
                }
            });
            */

            // const inputStart = '04-12-2018';
            // const inputEnd = '06-12-2018';

            const DATE_FORMAT_1 = 'YYYY-MM-DDTHH:mm:ss.SSS';
            const DATE_FORMAT_2 = 'DD-MM-YYYY';


            const fromDateTime = moment(req_start_date_time, DATE_FORMAT_2).startOf('day').format(DATE_FORMAT_1);
            const toDateTime = moment(req_end_date_time, DATE_FORMAT_2).endOf('day').format(DATE_FORMAT_1);
            console.log(`fromDateTime: ${fromDateTime} , toDateTime: ${toDateTime}`);

            const items = await AWSManager.getArticles(fromDateTime, toDateTime);
            if (!_.isNull(items) && items.length > 0) {
                console.log(`getArticles succeeded. size: ${items.length}`);
                items.forEach(function(item) {
                    console.log(`${JSON.stringify(item)}`);
                    // console.log(`${item.created_at} : ${item.title}`);
                    const tUrl = item.thumbnailUrl;
                    const tFilename = item.thumbnailFilename;

                    const newObj = {
                        title : item.title,
                    };

                    articles.push(newObj);
                });
            }
                // .then(items => {
                //     console.log(`getArticles succeeded. size: ${items.length}`);
                //     items.forEach(function(movie) {
                //         console.log(movie.created_at + ": ", movie.title);
                //     });
                // })
                // .catch(err => {
                //     console.log(`getArticles error: ${err}`);
                // });




            // Article
            //     .find({}, '_id title thumbnail posted_at')
            //     .limit(sizePerPage + carouselLength)
            //     .skip(sizePerPage * pageNum + carouselLength)
            //     .sort({'posted_at': -1})
            //     // .populate( 'contents', '-_id type subtitle media_url content')
            //     .then((result) => {
            //         // console.log(result);
            //         console.log(result.length);
            //
            //
            //
            //         let responseModel = {};
            //
            //         if (result.length >= carouselLength) {
            //             const tmpCarouseList = _.slice(result, 0, carouselLength);
            //             const tmpList = _.slice(result, carouselLength, result.length);
            //
            //             responseModel = {
            //                 carousel: tmpCarouseList,
            //                 list: tmpList
            //             };
            //
            //         } else {
            //             responseModel = {
            //                 carousel: result,
            //                 list: []
            //             };
            //         }
            //
            //         res.send(responseModel)
            //     })
            // ;

            res.status(200).send(articles);


        } catch (e) {
            return res.status(500).send(e);
        }




        /*

        try {
            const req_page_no = req.body.page;
            const req_item_per_page = req.body.limit;

            // let sizePerPage = 4;
            // let pageNum = Math.abs(req.body.page);   // Math.abs(req.query.limit)

            let sizePerPage = req_item_per_page;
            let pageNum = req_page_no;
            let carouselLength = 0;

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

        */




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