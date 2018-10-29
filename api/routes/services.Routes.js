module.exports = function(app) {

    var Services = require ('../controllers/services.controllers') ; 
    app.route('/Services')
        .get(Services.get_all_services) ; 

}
