var uniqid = require('uniqid');

exports.get_all_locations = (req , res , next ) => {

    req.db.query('Select * FROM locations' , (error, results , fields) => {
        if (error){

            res.send({
                  "IsSuccess": false,
                  "ErrorMessage": error,
                  "StatusCode": 500,
                  "Response": ""
              });
              return next()  ;
          } 
        
           res.send({
               "IsSuccess": true,
               "ErrorMessage": "",
               "StatusCode": 200,
               "Response": results
           }) ;
           return next()  ; 
           
          
    }); 
     
} 

exports.add_location = (req , res , next ) => {
    let id = uniqid() ;
    var body = [] ; 
    body.push(id , req.body.LocationName) ;  
    if (req.body.LocationName === undefined || req.body.LocationName === null || req.body.LocationName === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "LocationName Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }
    

    req.db.query('INSERT INTO locations (LocationID , LocationName) VALUES(?)',[body], (error, results ) => {
        if (error){

              res.send({
                  "IsSuccess": false,
                  "ErrorMessage": error,
                  "StatusCode": 500,
                  "Response": ""
              });
              return next()  ;
          } 
        
           res.send({
               "IsSuccess": true,
               "ErrorMessage": "",
               "StatusCode": 200,
               "Response": "Location Added Successfully."
           }) ;
           return next()  ; 
           
          
    }); 
     
} 

exports.delete_location = (req , res , next ) => {
    if (req.body.LocationID === undefined || req.body.LocationID === null || req.body.LocationID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "LocationID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }
    

    req.db.query('DELETE FROM locations WHERE LocationID = ? ',[req.body.LocationID], (error, results) => {
        if (error){

              res.send({
                  "IsSuccess": false,
                  "ErrorMessage": error,
                  "StatusCode": 500,
                  "Response": ""
              });
              return next()  ;
          } 
        
           res.send({
               "IsSuccess": true,
               "ErrorMessage": "",
               "StatusCode": 200,
               "Response": "Location Deleted Successfully."
           }) ;
           return next()  ; 
           
          
    }); 
     
} 
