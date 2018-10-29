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

    var Apartment = require('../controllers/apartments.controller');
    app.route('/AlAndalus/api/Apartments/GetApartments')
        .get(Apartment.get_apartments);

    app.route('/AlAndalus/api/Apartments/GetApartmentDetails')
        .post(Apartment.get_apartment_details);

    app.route('/AlAndalus/api/Apartments/AddApartment')
        .post(upload.array('ApartmentImages', 20), Apartment.insert_apartment);

    app.route('/AlAndalus/api/Apartments/EditApartment')
        .post(upload.array('ApartmentImages', 20), Apartment.edit_apartment);

    app.route('/AlAndalus/api/Apartments/DeleteApartment')
        .post(Apartment.delete_apartment);

    app.route('/AlAndalus/api/Apartments/AddImage')
        .post(Apartment.add_image_apartment , upload.array('ApartmentImages', 20));

    app.route('/AlAndalus/api/Apartments/DeleteImage')
        .post(Apartment.delete_image_apartment);

    app.route('/AlAndalus/api/Apartments/AddVideo')
        .post(Apartment.add_video_apartment);

    app.route('/AlAndalus/api/Apartments/DeleteVideo')
        .post(Apartment.delete_video_apartment);
    
        app.route('/AlAndalus/api/Apartments/GetImages')
        .post(Apartment.get_images);

    app.route('/AlAndalus/api/Apartments/GetVideos')
        .post(Apartment.get_videos);
    
}