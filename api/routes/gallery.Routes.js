module.exports = (app) => {

    const multer = require('multer');
    const storage = multer.diskStorage({

        destination: function (req, file, cb) {
            cb(null, __dirname.replace('routes', '') + '../public/uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
    const filefilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
            cb(null, true);
        else
            cb(new Error('Not Support ' + file.mimetype), false);
    }
    const upload = multer({
        storage: storage,
        fileFilter: filefilter
    });

    var Gallery = require('../controllers/gallery.controller');

    app.route('/AlAndalus/api/Gallery/GetImages')
        .get(Gallery.get_images_gallery);

    app.route('/AlAndalus/api/Gallery/GetVideos')
        .get(Gallery.get_videos_gallery);

    app.route('/AlAndalus/api/Gallery/DeleteImage')
        .post(Gallery.delete_image_gallery);

    app.route('/AlAndalus/api/Gallery/DeleteVideo')
        .post(Gallery.delete_video_gallery);

    app.route('/AlAndalus/api/Gallery/AddImage')
        .post(upload.array('GalleryImages', 20), Gallery.add_image_gallery);

    app.route('/AlAndalus/api/Gallery/AddVideo')
        .post(Gallery.add_video_gallery);

}