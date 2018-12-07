


module.exports = {
    getArticles : (fromDateTime, toDateTime) => {
        return new Promise((resolve, reject) => {
            console.log('getAllArticle');

            const params = {
                TableName: AWSConfig.ddbTableNameArticle,
                ProjectionExpression: 'articleId, created_at, title, thumbnailUrl, thumbnailFilename',
                FilterExpression: '#createdDateTime between :fromDateTime and :toDateTime',
                ExpressionAttributeNames: {
                    '#createdDateTime': 'created_at',
                },
                ExpressionAttributeValues: {
                    // ':fromDateTime': '2018-12-04T00:00:00.000Z',
                    // ':toDateTime': '2018-12-06T23:59:59.000Z',
                    ':fromDateTime': fromDateTime,
                    ':toDateTime': toDateTime,
                }
            };


            docClient.scan(params, (err, data) => {
                if (err) {
                    console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    // print all the movies
                    // console.log(`data: ${ JSON.stringify(data) }`);
                    // console.log(`Scan succeeded. size: ${data.Items.length}`);
                    // data.Items.forEach(function(movie) {
                    //     console.log(movie.created_at + ": ", movie.title);
                    // });

                    resolve(data.Items);

                    // continue scanning if we have more movies, because
                    // scan can retrieve a maximum of 1MB of data
                    // if (typeof data.LastEvaluatedKey != "undefined") {
                    //     console.log("Scanning for more...");
                    //     params.ExclusiveStartKey = data.LastEvaluatedKey;
                    //     docClient.scan(params, onScan);
                    // }
                }
            });

        });
    },

    getImageFromUrl : (bucketName, imageUrl) => {
        return new Promise((resolve, reject) => {
            getS3Object(bucketName, imageUrl)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },

    getArticleContents : (articleId) => {
        return new Promise(async (resolve, reject) => {
            let result = [];

            const articleResult = await findOneArticleFromDynamoDB(articleId);
            if (!_.isNull(articleResult)) {
                const contentList = await findArticleDetailFromDynamoDB(articleId);
                if (!_.isNull(contentList)) {
                    // console.log(`detailResult: ${ JSON.stringify(contentList) }`);

                    for (const content of contentList) {
                        // console.log(`content: ${ JSON.stringify(content) } \n\n`);

                        const newObj = {
                            content : content.content,
                            articleId : content.articleId,
                            id : content.id,
                            contentType : content.contentType,
                        };
                        result.push(newObj);
                    }

                    resolve(result);
                } else {
                    reject(new Error('Fail to get Article Detail'));
                }
            } else {
                reject(new Error('Fail to get Article'));
            }

        });
    },




};

function getS3Object(bucketName, key) {
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

function findOneArticleFromDynamoDB(articleId) {
    const params = {
        TableName : AWSConfig.ddbTableNameArticle,
        Key: {
            'articleId' : {S: articleId},
        },
        ProjectionExpression: 'articleId, title, thumbnailUrl, contents'
    };
    return ddb.getItem(params).promise();
}

function findArticleDetailFromDynamoDB(id) {
    // const params = {
    //     TableName : AWSConfig.ddbTableNameArticleDetail,
    //     Key: {
    //         'articleId' : {S: id},
    //     },
    //     ProjectionExpression: 'id, articleId, content'
    // };
    // return ddb.getItem(params).promise();


    return new Promise((resolve, reject) => {
        // console.log(`findOneArticleDetailFromDynamoDB: ${ JSON.stringify(id) }`);

        const params = {
            TableName: AWSConfig.ddbTableNameArticleDetail,
            ProjectionExpression: 'id, articleId, content, contentType',
            FilterExpression: '#article_id = :articleId',
            ExpressionAttributeNames: {
                '#article_id': 'articleId',
            },
            ExpressionAttributeValues: {
                ':articleId': id,
            }
        };


        docClient.scan(params, (err, data) => {
            if (err) {
                console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
                reject(err);
            } else {
                // print all the movies
                // console.log(`data: ${ JSON.stringify(data) }`);
                // console.log(`Scan succeeded. size: ${data.Items.length}`);
                // data.Items.forEach(function(movie) {
                //     console.log(movie.created_at + ": ", movie.title);
                // });

                resolve(data.Items);

                // continue scanning if we have more movies, because
                // scan can retrieve a maximum of 1MB of data
                // if (typeof data.LastEvaluatedKey != "undefined") {
                //     console.log("Scanning for more...");
                //     params.ExclusiveStartKey = data.LastEvaluatedKey;
                //     docClient.scan(params, onScan);
                // }
            }
        });
    });
}