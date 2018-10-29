const express = require('express');
const parser = require('body-parser');
const app = express();

app.listen(4000, () => console.log(`listning to port 4000`));
var mysql = require('mysql');
app.use(express.static('public')) ; 

app.use(parser.urlencoded({
  extended: true
}));
app.use(parser.json());


app.use((req, res, next) => {
  

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', '*');

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');

  res.setHeader('Access-Control-Allow-Credentials', true);

  
  
  next();
  

});

app.use((req, res, next) => {

  req.db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Al_Ahly74',
    database: 'andalus',
    multipleStatements: true
  });
  
  req.db.connect();
  next();
  
}); 




var routes1 = require('./api/routes/services.Routes');
var routes2 = require('./api/routes/about.Routes');
var routes3 = require('./api/routes/projects.Routes');
var routes4 = require('./api/routes/apartments.Routes');
var routes5 = require('./api/routes/search.Routes');
var routes6 = require('./api/routes/gallery.Routes');
var routes7 = require('./api/routes/joinus.Routes');
var routes8 = require('./api/routes/locations.Routes');

routes1(app);
routes2(app);
routes3(app);
routes4(app);
routes5(app);
routes6(app);
routes7(app);
routes8(app);

app.use((req, res ) => {
  
  req.db.end();

}) ; 