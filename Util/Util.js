module.exports = {
    saveImageFromS3 : (s3Result, path, filename) => {
        return new Promise((resolve, reject) => {
            console.log('saveImageFromS3');

            const fullPath = path  + filename;
            const body = s3Result.Body;
            console.log(`body_length: ${body.length} , fullPath: ${fullPath}`);


            fs.writeFile(fullPath, body, {flag: 'wx'}, (err) => {
                if (err) {
                    console.log(`writeFile error: ${err}`);


                    reject(err);
                }
                resolve(filename);
            });
            // if (!_.isNull(result)) {
            //     resolve('okok');
            // } else {
            //     reject('asasdf');
            // }



            // const wstream = fs.createWriteStream(fullPath);
            // wstream.write(body);
            // wstream.end();


        });
    },

    getImageUrlFromSavedImage : (filenameWithExt) => {
        return new Promise((resolve, reject) => {

        });
    },

    isFileExist : (fullPathWithFileNameAndExt) => {
        let isExist = false;
        if (fs.existsSync(fullPathWithFileNameAndExt)) {
            isExist = true;
        }
        return isExist;
    },

    getHostUrl : (req) => {
        return req.protocol + '://' + req.get('host');
    },

    convertS3ImageToHostUrl : async (req, filename, s3Url) => {
        let hostImgPath = '';

        const imageResult = await AWSManager.getImageFromUrl(AWSConfig.bucketName_Article, s3Url);
        if (!_.isNull(imageResult)) {
            // console.log(`\n\n\n`);
            // console.log(`imageResult: ${ imageResult.Body.length } , filename: ${ filename }`);

            const filePath = path.join(rootPath, imageDestPath);
            // console.log(`path: ${ filePath }`);

            const fullPath = filePath + filename;
            const isExist = await Util.isFileExist(fullPath);
            if (!isExist) {
                const savedFileName = await Util.saveImageFromS3(imageResult, filePath, filename);
                if (!_.isNull(savedFileName)) {
                    // console.log(`savedResult success = ${savedFileName}`);
                    hostImgPath = Util.getHostUrl(req) + '/' + imageDestPath +  savedFileName;
                }
            } else {
                hostImgPath = Util.getHostUrl(req) + '/' + imageDestPath + filename;
            }

        }

        return hostImgPath;
    },

    // loadImageFromUrl : (imageUrl) => {
    //     return new Promise((resolve, reject) => {
    //
    //     });
    // },


};

// function download(uri, filename, callback){
//     request.head(uri, function(err, res, body){
//         console.log('content-type:', res.headers['content-type']);
//         console.log('content-length:', res.headers['content-length']);
//
//         request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//     });
// };