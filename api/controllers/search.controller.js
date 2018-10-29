var uniqid = require('uniqid');
var fs = require('fs');
var rimraf = require('rimraf');

exports.search_advanced = (req, res , next) => {

    let BoolArray = [{
        'Bool': "",
        'Clause': "",
        'Element': ""
    }];
    for (var i = 0; i < 5; i++) {
        BoolArray.push({
            'Bool': "",
            'Clause': "",
            'Element': ""
        });
    }
    var Whereclause = " WHERE ";
    if (req.body.Status === undefined || req.body.Status === null || req.body.Status === "") {
        BoolArray[0].Bool = false;
    } else {
        BoolArray[0].Bool = true;
        BoolArray[0].Clause = "Status = "
        BoolArray[0].Element = req.body.Status;
    }
    if (req.body.Location === undefined || req.body.Location === null || req.body.Location === "") {
        BoolArray[1].Bool = false;
    } else {

        BoolArray[1].Bool = true;
        BoolArray[1].Clause = "Location = ";
        BoolArray[1].Element = req.body.Location;
    }
    if (req.body.Area === undefined || req.body.Area === null || req.body.Area === "") {
        BoolArray[2].Bool = false;
    } else {
        BoolArray[2].Bool = true;
        BoolArray[2].Clause = "Area >= ";
        BoolArray[2].Element = req.body.Area;

    }
    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {
        BoolArray[3].Bool = false;
    } else {
        BoolArray[3].Bool = true;
        BoolArray[3].Clause = "Project_ID = ";
        BoolArray[3].Element = req.body.ProjectID;

    }

    if ((req.body.PriceTo === undefined || req.body.PriceTo === null || req.body.PriceTo === "") && (req.body.PriceFrom === undefined || req.body.PriceFrom === null || req.body.PriceFrom === "")) {
        BoolArray[4].Bool = false;
    } else {
        BoolArray[4].Bool = true;
        BoolArray[4].Clause = "Price BETWEEN "
        BoolArray[4].Element = req.body.PriceFrom;

    }
    let w = false,
        query = ``,
        flag = false,
        units = false;
    for (var i = 0; i < BoolArray.length; i++) {
        if (flag && BoolArray[i].Bool) {
            query += ' AND ';
            flag = false;
        }

        if (i == 4 && BoolArray[i].Bool) {
            query += BoolArray[i].Clause + '"' + `${BoolArray[i].Element.toString()}` + '"';
            query += ' AND ' + `${req.body.PriceTo}`;
            w = true;
            flag = true;

        } else if (BoolArray[i].Bool) {
            query += BoolArray[i].Clause + '"' + `${BoolArray[i].Element.toString()}` + '"';
            w = true;
            flag = true;
            if (i == 3)
                units = true;


        }

    }

    if (!w)
        Whereclause = "";

    let all = [] , Allsearch = [];
            
    if (!units) {
        
        req.db.query("SELECT * FROM apartments " + Whereclause + query, (error, results, fields) => {
            if (error){

                  res.send({
                      "IsSuccess": false,
                      "ErrorMessage": error,
                      "StatusCode": 500,
                      "Response": ""
                  });
                  return next()  ;
              } 
              
            let images;
            for (var i = 0; results !== undefined && i < results.length; i++) {
                let AImgs = [];

                images = fs.readdirSync(`public/uploads/${results[i].ApartmentID}`);

                for (var j = 0; images !== undefined && j < images.length; j++) {
                    AImgs.push({
                        'ImageUrl': `http://yakensolution.cloudapp.net:4000/uploads/${results[i].ApartmentID}/${images[j]}`
                    });
                }
                all.push({
                    "ApartmentID": results[i].ApartmentID,
                    "ApartmentType": results[i].ApartmentType,
                    "Description": results[i].Description,
                    "Area": results[i].Area,
                    "Price": results[i].Price,
                    "Rooms": results[i].Rooms,
                    "Bedrooms": results[i].Bedrooms,
                    "Bathrooms": results[i].Bathrooms,
                    "ApartmentTitle": results[i].ApartmentTitle,
                    "Status": results[i].Status,
                    "Location": results[i].Location,
                    "Images": AImgs

                });
            }


        });

        req.db.query("SELECT * FROM projectunits " + Whereclause + query, (error, results, fields) => {
            var PU = [];
            if (error){

                  res.send({
                      "IsSuccess": false,
                      "ErrorMessage": error,
                      "StatusCode": 500,
                      "Response": ""
                  });
                  return next()  ;
              } 
              
            for (var i = 0; results !== undefined && i < results.length; i++) {
                PU.push({
                    "UnitID": results[i].UnitID,
                    "UnitType": results[i].UnitType,
                    "UnitTitle": results[i].UnitTitle,
                    "UnitPrice": results[i].Price,
                    "UnitArea": results[i].Area,
                    "UnitFinishing": results[i].Finishing,
                    "UnitDeliveryDate": results[i].DeliveryDate,
                    "UnitPaymentTerms": results[i].PaymentTerms,
                    "UnitLocation": results[i].Location,
                    "UnitStatus": results[i].Status,
                    "UnitBathrooms": results[i].Bathrooms,
                    "UnitBedrooms": results[i].Bedrooms,
                    "ProjectID": results[i].Project_ID,
                    
                });

            }
            Allsearch.push({
                "Apartments": all,
                "Units": PU

            });

            res.send({
                "IsSuccess": true,
                "ErrorMessage": "",
                "StatusCode": 200,
                "Response": Allsearch
            });
            return next()  ;


        });


    }
     else {
        req.db.query("SELECT * FROM projectunits " + Whereclause + query, (error, results, fields) => {
            var PU = [];
            if (error){

                  res.send({
                      "IsSuccess": false,
                      "ErrorMessage": error,
                      "StatusCode": 500,
                      "Response": ""
                  });
                  return next()  ;
              } 
              
            for (var i = 0; results !== undefined && i < results.length; i++) {
                PU.push({
                    "UnitID": results[i].UnitID,
                    "UnitType": results[i].UnitType,
                    "UnitTitle": results[i].UnitTitle,
                    "UnitPrice": results[i].Price,
                    "UnitArea": results[i].Area,
                    "UnitFinishing": results[i].Finishing,
                    "UnitDeliveryDate": results[i].DeliveryDate,
                    "UnitPaymentTerms": results[i].PaymentTerms,
                    "UnitLocation": results[i].Location,
                    "UnitStatus": results[i].Status,
                    "UnitBathrooms": results[i].Bathrooms,
                    "UnitBedrooms": results[i].Bedrooms,
                    "ProjectID": results[i].Project_ID,

                });

            }
            Allsearch.push({
                "Apartments": [],
                "Units": PU
                
            })

            res.send({
                "IsSuccess": true,
                "ErrorMessage": "",
                "StatusCode": 200,
                "Response": Allsearch
            });
            return next()  ;


        });

    }

}