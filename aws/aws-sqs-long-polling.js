'use strict';

const cron = require('node-cron');
const AWS = require('aws-sdk');
const _ = require('lodash');

const Article = require('./../schema/Article');

const region = 'ap-southeast-1';

// hardcoded
const articleQueueUrl = 'https://sqs.ap-southeast-1.amazonaws.com/340288593666/ArticleQueue';

const articleLinkQueueName = 'ArticleLinkQueue';
const articleQueueName = 'ArticleQueue';

// const task = cron.schedule('*/10 * * * * *', () => {
//     scheduleTask();
// }, {
//     scheduled: false
// });

const task = cron.schedule('*/5 * * * * *', scheduleTask, {
    scheduled: false
});

AWS.config.update({
    region: region
});

const sqs = new AWS.SQS({
    region: region
});


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


}

function scheduleTask() {
    console.log('Schedule task is running');
    monitorSQS(articleQueueUrl);
}

function monitorSQS(queueUrl) {
    console.log('monitorSQS: ', queueUrl);
    // const qAttParams = {
    //     QueueUrl: queueUrl,
    //     Attributes: {
    //         'ReceiveMessageWaitTimeSeconds': '20',
    //     }
    // };

    // sqs.setQueueAttributes(qAttParams, (err, data) => {
    //     if (err) {
    //         console.log('error: ', err);
    //     } else {
    //         console.log('success: ', data);
    //     }
    // });

    const params = {
        QueueUrl: queueUrl,
        WaitTimeSeconds: 20,
        AttributeNames: [
            "SentTimestamp"
        ],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: [
            "All"
        ],


    };

    sqs.receiveMessage(params, (err, data) => {
        if (err) {
            console.log('error: ', err);
        } else {
            // console.log('success: ', JSON.stringify(data));

            const messages = data.Messages;

            _.forEach(messages, function(message) {
                // console.log('message: ', JSON.stringify(message));

                const messageId = message.MessageId;
                const receiptHandle = message.ReceiptHandle;
                const body = message.Body;

                const sqsArticleObj = JSON.parse(body);

                console.log('message: ', messageId, JSON.stringify(body));

                findOneArticle({ posted_at: sqsArticleObj.posted_at })
                    .then(articleObj => {
                        console.log('articleObj: ', articleObj, ' body: ', sqsArticleObj);

                        if (articleObj == null) {
                            insertArticle(sqsArticleObj)
                                .then(result => {
                                    console.log('insert_result: ', result);

                                    deleteMessage(articleQueueUrl, receiptHandle)
                                        .then(data => {
                                            console.log(`${ messageId } inserted into db, posted_at: ${ sqsArticleObj.posted_at } , title: ${ sqsArticleObj.title }`);
                                        })
                                        .catch(err => {
                                            console.log('delete SQS message failure: ', err);
                                        });
                                })
                                .catch(err => {
                                    console.log('insert article from SQS failure: ', err);
                                });
                        } else {
                            deleteMessage(articleQueueUrl, receiptHandle)
                                .then(data => {
                                    console.log(`${ messageId } deleted duplicated message from SQS, posted_at: ${ sqsArticleObj.posted_at } , title: ${ sqsArticleObj.title }`);
                                })
                                .catch(err => {
                                    console.log('delete SQS message failure: ', err);
                                });
                        }

                    })
                    .catch(err => {
                        console.log('find article from db failure: ', err);
                    });


                // try {
                //     Article
                //         .findOne({ posted_at: body.posted_at })
                //         .then((result) => {
                //             console.log(result);
                //
                //             if (result == null) {
                //                 // insert into db
                //             } else {
                //                 // delete from sqs
                //             }
                //
                //         })
                // } catch (e) {
                //     console.error('Error to find Article in db by post_at: ', e);
                // }


            });

        }
    });
}


function findOneArticle(articleObject) {
    return new Promise((resolve, reject) => {
        if (articleObject) {
            Article.findOne({ posted_at: articleObject.posted_at })
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

function insertArticle(articleObject) {
    return new Promise((resolve, reject) => {
        if (articleObject) {
            Article.create({
                title: articleObject.title,
                thumbnail: articleObject.thumbnail,
                posted_at: articleObject.posted_at,
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

function deleteMessage(queueUrl, receiptHandle) {
    return new Promise((resolve, reject) => {
        const params = {
            QueueUrl: queueUrl,
            ReceiptHandle: receiptHandle
        };
        sqs.deleteMessage(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}