module.exports = function(app) {
    var About = require('../controllers/about.controllers') ; 
    app.route('/AlAndalus/api/About/GetAbout')
    .get(About.get_about) ;  
}