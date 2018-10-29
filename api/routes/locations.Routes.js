module.exports = function(app) {

    var Locations = require ('../controllers/locations.controller') ; 
    app.route('/AlAndalus/api/Locations/GetLocations').get(Locations.get_all_locations) ; 
    app.route('/AlAndalus/api/Locations/AddLocation').post(Locations.add_location) ; 
    app.route('/AlAndalus/api/Locations/DeleteLocation').post(Locations.delete_location) ; 
    
}
