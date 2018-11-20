'use strict';

const cron = require('node-cron');
const AWS = require('aws-sdk');
const _ = require('lodash');

const Article = require('./../schema/Article');

const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;
const s3Articles = process.env.AWS_S3_FOLDER_ARTICLE;
const s3ArticleLinks = process.env.AWS_S3_FOLDER_ARTICLE_LINK;
const s3ArticleDetail = process.env.AWS_S3_FOLDER_ARTICLE_DETAIL;
const s3Media = process.env.AWS_S3_FOLDER_MEDIA;


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

    // monitorSQS(articleQueueUrl);
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
                            console.log('getS3Object: ', dataStr);

                            const articleObj = JSON.parse(dataStr);
                            if (!_.isNull(articleObj)) {
                                // insertArticle(articleObj)
                                //     .then(insertResult => {
                                //         console.log('data insert success, title: ', articleObj.title);
                                //     })
                                //     .catch(error => {
                                //         console.log('Insert to db failure: ', error);
                                //     })
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
 * DB function
 */

function insertArticle(articleObject) {
    return new Promise((resolve, reject) => {
        if (articleObject) {
            Article.create({
                title: articleObject.title,
                thumbnail: articleObject.thumbnail,
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




