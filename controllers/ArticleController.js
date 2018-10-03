module.exports = {
    articleDetail : (req, res) => {
        res.send('articleDetail');
    },

    list : (req, res) => {
        res.send('article list');
    },

    articleDetailById : (req, res, next) => {

        const id = req.params.id;

        console.log('id: ' + id);

        res.send('123123 Audi Q7, BMW X5, Mercedes GL');
    },

};