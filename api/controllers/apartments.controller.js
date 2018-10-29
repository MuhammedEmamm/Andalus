var uniqid = require('uniqid');
var fs = require('fs');
var rimraf = require('rimraf');

exports.get_apartments = (req, res , next) => {


    req.db.query("SELECT * FROM apartments", (error, results, fields) => {

        if (error){

              res.send({
                  "IsSuccess": false,
                  "ErrorMessage": error,
                  "StatusCode": 500,
                  "Response": ""
              });
              return next() ; 
          } 
          
        let all = [],
            images;
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
                "Images": AImgs,


            });
        }

        res.send({
            "IsSuccess": true,
            "ErrorMessage": "",
            "StatusCode": 200,
            "Response": all
        })  ; 
        return next() ; 

    });


}

exports.get_apartment_details = (req, res , next) => {
    let apart = [] ; 
    let type ,id ; 
    if (req.body.ApartmentID === undefined || req.body.ApartmentID === null || req.body.ApartmentID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ApartmentID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    


    req.db.query("SELECT * FROM apartments WHERE ApartmentID =?", [req.body.ApartmentID], (error, results, fields) => {

        if (error){

              res.send({
                  "IsSuccess": false,
                  "ErrorMessage": error,
                  "StatusCode": 500,
                  "Response": ""
              });
              return next() ;
          } 
        apart = results ; 
        if(apart !== undefined){
            id = apart[0].ApartmentID ; 
            type = apart[0].ApartmentType ; 
        }
        
        req.db.query("SELECT * FROM apartments WHERE ApartmentType = ? AND ApartmentID != ?", [type , id], (error, results, fields) => {
     
            let all = [], images = []  , ar = [] ;
    
            for(var  i = 0 ; results !== undefined && i < results.length ; i++){
                let AImgs = [];
    
                images = fs.readdirSync(`public/uploads/${results[i].ApartmentID}`);
    
                for (var j = 0; images !== undefined && j < images.length; j++) {
                    AImgs.push({
                        'ImageUrl': `http://yakensolution.cloudapp.net:4000/uploads/${results[i].ApartmentID}/${images[j]}`
                    });
                }
                ar.push({
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
            for (var i = 0; apart !== undefined && i < apart.length; i++) {
                let AImgs = [];
    
                images = fs.readdirSync(`public/uploads/${apart[i].ApartmentID}`);
    
                for (var j = 0; images !== undefined && j < images.length; j++) {
                    AImgs.push({
                        'ImageUrl': `http://yakensolution.cloudapp.net:4000/uploads/${apart[i].ApartmentID}/${images[j]}`
                    });
                }
    
                all.push({
                    "ApartmentID": apart[i].ApartmentID,
                    "ApartmentType": apart[i].ApartmentType,
                    "Description": apart[i].Description,
                    "Area": apart[i].Area,
                    "Price": apart[i].Price,
                    "Rooms": apart[i].Rooms,
                    "Bedrooms": apart[i].Bedrooms,
                    "Bathrooms": apart[i].Bathrooms,
                    "ApartmentTitle": apart[i].ApartmentTitle,
                    "Status": apart[i].Status,
                    "Location": apart[i].Location,
                    "Images": AImgs , 
                    "RelatedApartments" : ar
    
                });
    
            }
    
            res.send({
                "IsSuccess": true,
                "ErrorMessage": "",
                "StatusCode": 200,
                "Response": all
            }) ;
            return next() ; 
    
    
        });


        
    }); 
    


}

exports.get_images = (req, res , next) => {
    let images;
    var PImgs = [];
    if (req.body.ApartmentID === undefined || req.body.ApartmentID === null || req.body.ApartmentID === "") {
        req.db.destroy();

        return res.send({
            "IsSuccess": false,
            "ErrorMessage": "ApartmentID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });

    }

    images = fs.readdirSync(`public/uploads/${req.body.ApartmentID}`);

    for (var j = 0; j < images.length; j++) {
        PImgs.push({
            'ImageName': images[j],
            'ImageUrl': `http://yakensolution.cloudapp.net:4000/uploads/${req.body.ApartmentID}/${images[j]}`
        });
    }

     res.send({
        "IsSuccess": true,
        "ErrorMessage": "",
        "StatusCode": 200,
        "Response": PImgs
    });
    return next() ; 


}

exports.get_videos = (req, res , next) => {
    let Videos = [];

    if (req.body.ApartmentID === undefined || req.body.ApartmentID === null || req.body.ApartmentID === "") {

         res.send({
            "IsSuccess": false,
            "ErrorMessage": "ApartmentID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }

    req.db.query("SELECT * FROM apartmentsvideos WHERE ApartmentID = ?", [req.body.ApartmentID], (error, results, fields) => {
        if (error) {

             res.send({
                "IsSuccess": false,
                "ErrorMessage": "",
                "StatusCode": 500,
                "Response": error
            });
            return next() ; 

        }
         else {
            for (var i = 0; results !== undefined && i < results.length; i++) {
                Videos.push({
                    "VideoID": results[i].VideoID,
                    "VideoTitle": results[i].VideoTitle,
                    "VideoUrl": results[i].VideoUrl,

                });
            }

             res.send({
                "IsSuccess": true,
                "ErrorMessage": "",
                "StatusCode": 200,
                "Response": Videos
            });
            return next() ; 
        }

    });



}

exports.insert_apartment = (req, res , next) => {
    let body = [];
    let ApoID = uniqid();

    body.push(req.body.ApartmentType, req.body.Description, req.body.Price, req.body.Area, req.body.Rooms, req.body.Bedrooms, req.body.Bathrooms, req.body.ApartmentTitle, req.body.Status, req.body.Location, ApoID);

    if (req.body.ApartmentType === undefined || req.body.ApartmentType === null || req.body.ApartmentType === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ApartmentType Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    
    if (req.body.Description === undefined || req.body.Description === null || req.body.Description === "") {

         res.send({
            "IsSuccess": false,
            "ErrorMessage": "Description Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.Price === undefined || req.body.Price === null || req.body.Price === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Price Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 

    }
    if (req.body.Area === undefined || req.body.Area === null || req.body.Area === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Area Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 

    }
    if (req.body.Rooms === undefined || req.body.Rooms === null || req.body.Rooms === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Rooms Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 

    }
    if (req.body.Bedrooms === undefined || req.body.Bedrooms === null || req.body.Bedrooms === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Bedrooms  Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.Bathrooms === undefined || req.body.Bathrooms === null || req.body.Bathrooms === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Bathrooms  Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.ApartmentTitle === undefined || req.body.ApartmentTitle === null || req.body.ApartmentTitle === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ApartmentTitle  Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.Status === undefined || req.body.Status === null || req.body.Status === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Status  Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.Location === undefined || req.body.Location === null || req.body.Location === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Location  Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }



    fs.mkdir(`./public/uploads/${ApoID}`);
    for (var i = 0; req.files !== undefined && i < req.files.length; i++) {
        fs.rename(`./public/uploads/${req.files[i].originalname}`, `./public/uploads/${ApoID}/${req.files[i].originalname}`);
    }

    req.db.query(`INSERT INTO apartments (ApartmentType , Description , Price , Area , Rooms , Bedrooms ,Bathrooms,ApartmentTitle,Status,Location, ApartmentID) VALUES (?) `, [body], (error, results) => {
        if (error){

              res.send({
                  "IsSuccess": false,
                  "ErrorMessage": error,
                  "StatusCode": 500,
                  "Response": ""
              });
              return next() ; 
          } 

        res.send({
            "IsSuccess": true,
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": "Apartment Added Successfully."
        });
        return next() ; 

    });






}

exports.edit_apartment = (req, res , next) => {

    if (req.body.ApartmentID === undefined || req.body.ApartmentID === null || req.body.ApartmentID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ApartmentID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }

    if (req.body.ApartmentType === undefined || req.body.ApartmentType === null || req.body.ApartmentType === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ApartmentType Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.Description === undefined || req.body.Description === null || req.body.Description === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Description Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.Price === undefined || req.body.Price === null || req.body.Price === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Price Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 

    }
    if (req.body.Area === undefined || req.body.Area === null || req.body.Area === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Area Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
        

    }
    if (req.body.Rooms === undefined || req.body.Rooms === null || req.body.Rooms === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Rooms Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 

    }
    if (req.body.Bedrooms === undefined || req.body.Bedrooms === null || req.body.Bedrooms === "") {

         res.send({
            "IsSuccess": false,
            "ErrorMessage": "Bedrooms Elements Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.Bathrooms === undefined || req.body.Bathrooms === null || req.body.Bathrooms === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Bathrooms Elements Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.ApartmentTitle === undefined || req.body.ApartmentTitle === null || req.body.ApartmentTitle === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ApartmentTitle  Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.Status === undefined || req.body.Status === null || req.body.Status === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Status  Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }

    if (req.body.Location === undefined || req.body.Location === null || req.body.Location === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Location  Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }


    for (var i = 0; req.files !== undefined && i < req.files.length; i++) {
        fs.rename(`./public/uploads/${req.files[i].originalname}`, `./public/uploads/${req.body.ApartmentID}/${req.files[i].originalname}`);
    }
    req.db.query('UPDATE apartments SET ApartmentType = ? , Description= ? , Price = ?  , Area =? , Rooms=? , Bedrooms=? , Bathrooms=? ,ApartmentTitle = ? , Status = ? , Location = ?   WHERE ApartmentID = ?', [req.body.ApartmentType, req.body.Description, req.body.Price, req.body.Area, req.body.Rooms, req.body.Bedrooms, req.body.Bathrooms, req.body.ApartmentTitle, req.body.Status, req.body.Location, req.body.ApartmentID], (error, results) => {
        if (error){
            req.db.destroy();

            return  res.send({
                  "IsSuccess": false,
                  "ErrorMessage": error,
                  "StatusCode": 500,
                  "Response": ""
              });
          } 
          
        var ResponseMessage;
        if (results.affectedRows === 0)
            ResponseMessage = "Not Valid ID."
        else
            ResponseMessage = "Apartment Changed Successfully."
            req.db.destroy();

       return res.send({
            "IsSuccess": true,
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": ResponseMessage
        });
    });


}

exports.delete_apartment = (req, res , next) => {

    if (req.body.ApartmentID === undefined || req.body.ApartmentID === null || req.body.ApartmentID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ApartmentID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
        
    }

    rimraf(`./public/uploads/${req.body.ApartmentID}`, function () {
        console.log('done');
    });

    req.db.query('DELETE FROM apartments WHERE ApartmentID = ?', [req.body.ApartmentID], (error, results) => {
        if (error){

              res.send({
                  "IsSuccess": false,
                  "ErrorMessage": error,
                  "StatusCode": 500,
                  "Response": ""
              });
              return next() ; 
          } 
          
        var ResponseMessage;
        if (results.affectedRows === 0)
            ResponseMessage = "Not Valid ID."
        else
            ResponseMessage = "Apartment Deleted Successfully."

        res.send({
            "IsSuccess": true,
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": ResponseMessage
        });
        return next() ; 
    });




}

exports.add_image_apartment = (req, res , next) => {
    if (req.body.ApartmentID === undefined || req.body.ApartmentID === null || req.body.ApartmentID === "") {

         res.send({
            "IsSuccess": false,
            "ErrorMessage": "ApartmentID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    for (var i = 0; req.files !== undefined && i < req.files.length; i++) {
        fs.rename(`./public/uploads/${req.files[i].originalname}`, `./public/uploads/${req.body.ApartmentID}/${req.files[i].originalname}`);
    }

    res.send({
        "IsSuccess": true,
        "ErrorMessage": null,
        "StatusCode": 200,
        "Response": "Image Added Successfully."
    });
    return next() ; 


}


exports.delete_image_apartment = (req, res , next) => {
    if (req.body.ApartmentID === undefined || req.body.ApartmentID === null || req.body.ApartmentID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ApartmentID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.ImageName === undefined || req.body.ImageName === null || req.body.ImageName === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ImageName Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }

    fs.unlink(`./public/uploads/${req.body.ApartmentID}/${req.body.ImageName}`);

    res.send({
        "IsSuccess": true,
        "ErrorMessage": null,
        "StatusCode": 200,
        "Response": "Image Deleted Successfully."
    });
    return next() ; 




}

exports.add_video_apartment = (req, res , next) => {


    if (req.body.ApartmentID === undefined || req.body.ApartmentID === null || req.body.ApartmentID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ApartmentID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.VideoTitle === undefined || req.body.VideoTitle === null || req.body.VideoTitle === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "VideoTitle Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.VideoUrl === undefined || req.body.VideoUrl === null || req.body.VideoUrl === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "VideoUrl Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }

    let body = [];
    let VID = uniqid();

    body.push(VID, req.body.VideoTitle, req.body.VideoUrl, req.body.ApartmentID);

    req.db.query(`INSERT INTO apartmentsvideos (VideoID , VideoTitle , VideoUrl , ApartmentID) VALUES (?) `, [body], (error, results) => {
        if (error) {

            res.send({
                "IsSuccess": false,
                "ErrorMessage": error,
                "StatusCode": 500,
                "Response": ""
            });
            return next() ; 
        }

        res.send({
            "IsSuccess": true,
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": "Video Added Successfully."
        });
        return next() ; 


    });




}

exports.delete_video_apartment = (req, res , next) => {
    if (req.body.ApartmentID === undefined || req.body.ApartmentID === null || req.body.ApartmentID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ApartmentID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }
    if (req.body.VideoID === undefined || req.body.VideoID === null || req.body.VideoID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "VideoID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next() ; 
    }

    req.db.query(`DELETE FROM apartmentsvideos WHERE ApartmentID = ? AND VideoID = ?  `, [req.body.ApartmentID, req.body.VideoID], (error, results) => {
        if (error) {

            res.send({
                "IsSuccess": false,
                "ErrorMessage": error,
                "StatusCode": 500,
                "Response": ""
            });
            return next() ; 
        }

        res.send({
            "IsSuccess": true,
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": "Video Deleted Successfully."
        });
        return next() ; 

    });




}


