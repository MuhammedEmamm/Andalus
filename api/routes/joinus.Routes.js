module.exports = (app) => {

    const multer = require('multer');
    const storage = multer.diskStorage({

        destination: function (req, file, cb) {
            cb(null, __dirname.replace('routes', '') + '../public/files/');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
    const filefilter = (req, file, cb) => {
        if (file.mimetype === 'application/pdf')
            cb(null, true);
        else
            cb(new Error('Not Support ' + file.mimetype), false);
    }
    const upload = multer({
        storage: storage,
        fileFilter: filefilter
    });

    var Join_Us = require('../controllers/joinus.controller') ; 

    app.route('/AlAndalus/api/JoinUS/SendRequest')
    .post( upload.single('CV') , Join_Us.Join_US);



}