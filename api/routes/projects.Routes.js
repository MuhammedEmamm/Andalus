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

    var Project = require('../controllers/projects.controllers');
    app.route('/AlAndalus/api/Projects/GetProjects')
        .get(Project.get_projects);

    app.route('/AlAndalus/api/Projects/GetProjectImages')
        .post(Project.get_images);

    app.route('/AlAndalus/api/Projects/GetProjectVideos')
        .post(Project.get_videos);

    app.route('/AlAndalus/api/Projects/AddProject')
        .post(upload.array('ProjectImages', 20), Project.insert_projects);

    app.route('/AlAndalus/api/Projects/EditProject')
        .post(Project.edit_projects);

    app.route('/AlAndalus/api/Projects/DeleteProject')
        .post(Project.delete_projects);

    app.route('/AlAndalus/api/Projects/GetProjectDetails')
        .post(Project.get_project_details);

    app.route('/AlAndalus/api/Projects/GetUnitDetails')
        .post(Project.get_unit_details);

    app.route('/AlAndalus/api/Projects/AddUnit')
        .post(Project.add_unit);

    app.route('/AlAndalus/api/Projects/EditUnit')
        .post(Project.edit_unit);

    app.route('/AlAndalus/api/Projects/DeleteUnit')
        .post(Project.delete_unit);

    app.route('/AlAndalus/api/Projects/DeleteImage')
        .post(Project.delete_image_project);

    app.route('/AlAndalus/api/Projects/AddImage')
        .post(upload.array('ProjectImages', 20), Project.add_image_project);

    app.route('/AlAndalus/api/Projects/DeleteVideo')
        .post(Project.delete_video_project);

    app.route('/AlAndalus/api/Projects/AddVideo')
        .post(Project.add_video_project);

}