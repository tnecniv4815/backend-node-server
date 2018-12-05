'use strict';

const cron = require('node-cron');
const AWS = require('aws-sdk');
const _ = require('lodash');
const request = require('request');
const moment = require('moment');
const Url = require('url');
const Path = require('path');
const uuidv5 = require('uuid/v5');

const Article = require('./../schema/Article');

const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;
const s3Articles = process.env.AWS_S3_FOLDER_ARTICLE;
const s3ArticleLinks = process.env.AWS_S3_FOLDER_ARTICLE_LINK;
const s3ArticleDetail = process.env.AWS_S3_FOLDER_ARTICLE_DETAIL;
const s3Media = process.env.AWS_S3_FOLDER_MEDIA;

const DATE_FORMAT = 'YYYY-MM-DD_hh:mm:ss:SSS';


const task = cron.schedule('*/5 * * * * *', scheduleTask, {
    scheduled: false
});

AWS.config.update({
    region: region
});

const sqs = new AWS.SQS({
    region: region
});
const s3 = new AWS.S3();


init();

module.exports = {
    start: () => {
        console.log('Starting Long Polling');
        task.start();
    },
    stop: () => {
        console.log('Starting Long Polling');
        task.stop();
    }
};

function init() {
    console.log('init in aws');
    console.log('aws region: ', region);


}

function scheduleTask() {
    console.log('Schedule task is running');

    console.log('aws region: ', region);

    monitorS3Bucket();


    const imgUrl = 'https://p2.bahamut.com.tw/S/2KU/59/65c6ec3792ecdc239bc5000c8512ztr5.JPG';



    // fileUrlToData(imgUrl)
    //     .then(body => {
    //         console.log('fileUrlToData body: ', body.length);
    //
    //         createObjectInS3Bucket(bucketName, s3Media, 'good.jpg', body)
    //             .then(data => {
    //                 console.log('createObjectInS3Bucket_data: ', data);
    //             })
    //             .catch(err => {
    //                 console.log('createObjectInS3Bucket_err: ', err);
    //             });
    //
    //     })
    //     .catch(err => {
    //         console.log('fileUrlToData err: ', err);
    //     })


}

/**
 *
 */
function monitorS3Bucket() {
    // const listBucketResult = await listS3BucketsDirectories(bucketName, '/' + s3Articles);
    // if (listBucketResult != null) {
    //     console.log('listBucketResult: ', listBucketResult);
    // }

    listS3BucketsDirectories(bucketName, '/' + s3Articles)
        .then(listBucketResult => {
            // console.log('listS3BucketsDirectories listBucketResult: ', listBucketResult);

            const s3ResultList = getContentListFromBucketResult(listBucketResult);
            if (!_.isNull(s3ResultList) && s3ResultList.length > 0) {
                for (const s3ResultObj of s3ResultList) {
                    getS3Object(s3ResultObj.Key)
                        .then(s3DataObj => {
                            const dataStr = s3DataObj.Body.toString();
                            // console.log('getS3Object: ', dataStr);

                            const articleObj = JSON.parse(dataStr);
                            if (!_.isNull(articleObj)) {

                                const imgUrl = articleObj.thumbnail;
                                const filenameWithExt = uuidv5(imgUrl, uuidv5.URL) + '.' + getExtensionFromurl(imgUrl);

                                const thumbnailUrl = s3Media + '/' + filenameWithExt;

                                articleObj.thumbnailUrl = thumbnailUrl;

                                // console.log('\n\n thumbnailUrl: ', filenameWithExt, '\n\n');

                                fileUrlToData(imgUrl)
                                    .then(body => {
                                        // console.log('fileUrlToData body: ', body.length);

                                        findOneArticle({ title: articleObj.title })
                                            .then(findArticleObjResult => {
                                                if (findArticleObjResult == null) {

                                                    // save image to S3
                                                    createObjectInS3Bucket(bucketName, s3Media, filenameWithExt, body)
                                                        .then(data => {
                                                            console.log('thumbnail saved to S3: ', thumbnailUrl);
                                                        })
                                                        .catch(err => {
                                                            console.log('thumbnail save failure: ', err);
                                                        });


                                                    // insert data to db
                                                    insertArticle(articleObj)
                                                        .then(insertResult => {
                                                            console.log('article insert to db success, title: ', articleObj.title);
                                                        })
                                                        .catch(error => {
                                                            console.log('Article insert to db failure: ', error);
                                                        })
                                                }
                                            })
                                            .catch(err => {
                                                console.log('find article from db failure: ', err);
                                            });



                                    })
                                    .catch(err => {
                                        console.log('fileUrlToData err: ', err);
                                    })



                            }

                        })
                        .catch(error => {
                            console.log('Get object from S3 failure: ', error);
                        })
                }
            }


        })
        .catch(error => {
            console.log('listS3BucketsDirectories error: ', error);
        });

}

/**
 * Common
 */
function getCurrentTime() {
    const datetime = moment().format(DATE_FORMAT);

    return datetime;
}

function getExtensionFromurl(url) {
    let extension = '';

    if (!_.isNull(url) && url !== '') {
        extension = Path.extname(Url.parse(url).pathname).replace('.', '');
    }

    // console.log('getExtensionFromurl: ', extension);
    return extension;
}

function fileUrlToData(url) {
    // let data = null;
    // if (url !== '') {
    //     request.get(url, (err, response, body) => {
    //
    //     });
    // }
    // return data;
    return new Promise((resolve, reject) => {
        if (url !== '') {
            request.get({
                url: url,
                encoding: null
            }, (err, response, body) => {
                if (err) {
                    reject(err);
                }
                resolve(body);
            });
        }
    });
}

/**
 * DB function
 */

function insertArticle(articleObject) {
    return new Promise((resolve, reject) => {
        if (articleObject) {
            Article.create({
                title: articleObject.title,
                thumbnail: articleObject.thumbnailUrl,
            }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        } else {
            reject(new Error('Article Object is null'));
        }
    });
}

function findOneArticle(articleObject) {
    return new Promise((resolve, reject) => {
        if (articleObject) {
            Article.findOne({ title: articleObject.title })
                .then(result => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(null);
                    }
                })
        } else {
            reject(new Error('Article Object is null'));
        }
    });
}

/**
 * support function for S3
 */


function getContentListFromBucketResult(s3Result) {
    let list = [];

    const contents = s3Result.Contents;
    if (!_.isNull(contents) && contents.length > 0) {
        list = contents;

        // for (const content of contents) {
        //     list.push(content);
        // }
    }

    return list;
}

/**
 * S3
 */

function listS3BucketsDirectories(bucketName, directory) {
    const s3params = {
        Bucket: bucketName,
        MaxKeys: 20,
        Delimiter: directory,
    };
    return s3.listObjectsV2 (s3params).promise();
}

function getS3Object(key) {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: bucketName,
            Key: key
        };
        s3.getObject(params, function(err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

function createObjectInS3Bucket(bucketName, directory, fileNameWithExt, body) {
    const params = {
        Bucket: bucketName,
        Key: directory + '/' + fileNameWithExt,
        Body: body
    };
    return s3.upload(params).promise();
}

function moveObjectInS3(bucketName, fromDirectory, toDirectory, fileNameWithExt) {

}


