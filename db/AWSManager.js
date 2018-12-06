


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

    getImageFromUrl : (imageUrl) => {
        return new Promise((resolve, reject) => {
            getS3Object(AWSConfig.bucketName_Article, imageUrl)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
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