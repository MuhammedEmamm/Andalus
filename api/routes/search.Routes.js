module.exports = (app) => {

var Search = require('../controllers/search.controller') ; 

app.route('/AlAndalus/api/Search/AdvancedSearch')
        .post(Search.search_advanced);

}