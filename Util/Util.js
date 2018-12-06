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