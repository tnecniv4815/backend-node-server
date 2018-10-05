const User = require('./../schema/User');
// const ResultModel = require('./../model/ResultModel');
const ResultModel = reqlib('/model/ResultModel');

module.exports = {
    register : async (req, res, next) => {

        const req_email = req.body.email;
        const req_username = req.body.username;
        const req_password = req.body.password;
        const req_passwordConfirm = req.body.passwordConfirm;
        const req_displayName = req.body.displayName;

        console.log('email: ' + req_email);
        console.log('username: ' + req_username);
        console.log('password: ' + req_password);
        console.log('passwordConfirm: ' + req_passwordConfirm);
        console.log('displayName: ' + req_displayName);

        if (req_email && req_username && req_password
            && req_passwordConfirm && req_displayName) {

            try {
                //
                const userData = {
                    email: req_email,
                    username: req_username,
                    password: req_password,
                    passwordConfirm: req_passwordConfirm,
                    display_name: req_displayName
                };

                const existUser = await User.findOne({email: req_email}).exec();
                // console.log(existUser);

                if (!existUser) {
                    const newUser = new User(userData);
                    newUser.save((err) => {
                        if (!err) {
                            console.log('saved: ' + JSON.stringify(user));
                            res.send('registered');
                        } else {
                            console.log('err: ' + err);
                            res.send('saveError');
                        }
                    });
                } else {
                    console.log('reg_jor');
                    const errorObj = new ResultModel(200, 'reg_jor', {});
                    console.log(JSON.stringify(errorObj));

                    res.status(200).send(errorObj);
                }

                // insert data into db
                // User.findOne({email: req_email}, (findError, user) => {
                //     // console.log('user_find');
                //     // console.log(user);
                //     // console.log(findError);
                //
                //     if (!user) {
                //         user = new User(userData);
                //         user.save((saveError) => {
                //             if (!saveError) {
                //                 console.log('saved: ' + JSON.stringify(user));
                //                 res.send('registered');
                //             } else {
                //                 console.log('saveError: ' + saveError);
                //                 res.send('saveError');
                //             }
                //         });
                //     } else {
                //         // const existError = new Error('exist');
                //         res.send('existError');
                //     }
                //
                // });

            } catch (error) {
                res.send(error);
            }







            // const newUser = new User(userData);
            // newUser
            //     .save((error) => {
            //     console.log(error);
            //     if (error) {
            //         return new Error('Reg fail');
            //     }
            //
            //     res.send('reg jor');
            // });




        }

        // res.send('register');
    },

    login : (req, res) => {
        res.send('login');
    },
};