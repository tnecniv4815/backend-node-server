'use strict';

const cron = require('node-cron');
const AWS = require('aws-sdk');
const _ = require('lodash');

const region = 'ap-southeast-1';

// hardcoded
const articleQueueUrl = 'https://sqs.ap-southeast-1.amazonaws.com/340288593666/ArticleQueue';


AWS.config.update({
    region: region
});

const sqs = new AWS.SQS({
    region: region
});

console.log('starting....');


// monitorSQS(articleQueueUrl);



// const task = cron.schedule('*/10 * * * * *', scheduleTask);

// task.start();

// test only
// monitorSQS(articleQueueUrl);


console.log('finishing....');

function scheduleTask() {
    console.log('Schedule task is running');
    // monitorSQS(articleQueueUrl);
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
                console.log('message: ', JSON.stringify(message));
            });

        }
    });



}


function start() {
    console.log('Starting Long Polling');
}

function stop() {
    console.log('Starting Long Polling');
}


