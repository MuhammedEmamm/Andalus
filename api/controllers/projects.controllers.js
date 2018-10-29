var uniqid = require('uniqid');
var fs = require('fs');
var rimraf = require('rimraf');


exports.get_projects = (req, res , next) => {

    let projects, locations, images;

    req.db.query("SELECT * FROM projects", (error, results, fields) => {

        if (error) {

            res.send({
                "IsSuccess": false,
                "ErrorMessage": error,
                "StatusCode": 400,
                "Response": ""
            });
            return next()  ;
        }



        projects = results;
    });

    req.db.query("SELECT * FROM projectunits", (error, results, fields) => {
        let all = [];
        if (error) {

            res.send({
                "IsSuccess": false,
                "ErrorMessage": error,
                "StatusCode": 400,
                "Response": ""
            });
            return next()  ;
        }


        for (var i = 0; i < projects.length; i++) {
            var PImgs = [];
            var PU = [];
            images = fs.readdirSync(`public/uploads/${projects[i].Project_ID}`);

            for (var j = 0; j < images.length; j++) {
                PImgs.push({
                    'ImageUrl': `http://yakensolution.cloudapp.net:4000/uploads/${projects[i].Project_ID}/${images[j]}`
                });
            }


            for (var j = 0; j < results.length; j++) {
                if (projects[i].Project_ID === results[j].Project_ID) {
                    PU.push({
                        "UnitID": results[j].UnitID,
                        "UnitType": results[j].UnitType,
                        "UnitTitle": results[j].UnitTitle,
                        "UnitPrice": results[j].Price,
                        "UnitArea": results[j].Area,
                        "UnitFinishing": results[j].Finishing,
                        "UnitDeliveryDate": results[j].DeliveryDate,
                        "UnitPaymentTerms": results[j].PaymentTerms,
                        "UnitLocation": results[j].Location,
                        "UnitStatus": results[j].Status,
                        "UnitBathrooms": results[j].Bathrooms,
                        "UnitBedrooms": results[j].Bedrooms,

                    });
                }
            }


            all.push({
                "ProjectID": projects[i].Project_ID,
                "ProjectName": projects[i].ProjectName,
                "ProjectPrice": projects[i].Price,
                "ProjectBenefits": projects[i].Benefits,
                "ProjectDescription": projects[i].Description,
                "ProjectImages": PImgs,
                "ProjectUnits": PU,
                "ProjectLocation": projects[i].Location

            });

        }

        res.send({
            "IsSuccess": true,
            "ErrorMessage": "",
            "StatusCode": 200,
            "Response": all
        });
        return next()  ;


    });
    

}
exports.get_images = (req, res , next) => {
    let images;
    var PImgs = [];
    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;

    }

    images = fs.readdirSync(`public/uploads/${req.body.ProjectID}`);

    for (var j = 0; j < images.length; j++) {
        PImgs.push({
            'ImageName': images[j],
            'ImageUrl': `http://yakensolution.cloudapp.net:4000/uploads/${req.body.ProjectID}/${images[j]}`
        });
    }

    res.send({
        "IsSuccess": true,
        "ErrorMessage": "",
        "StatusCode": 200,
        "Response": PImgs
    });
    return next()  ;

}

exports.get_videos = (req, res , next) => {
    let Videos = [];

    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;

    }

    req.db.query("SELECT * FROM projectvideos WHERE Project_ID = ?", [req.body.ProjectID], (error, results, fields) => {
        if (error) {

            res.send({
                "IsSuccess": false,
                "ErrorMessage": "",
                "StatusCode": 500,
                "Response": error
            });
            return next()  ;
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
            return next()  ;
        }

    });



}

exports.insert_projects = (req, res , next) => {
    let body = [];
    let ProID = uniqid();

    body.push(req.body.ProjectName, req.body.Price, req.body.Benefits, req.body.Description, req.body.Location, ProID);

    if (req.body.ProjectName === undefined || req.body.ProjectName === null || req.body.ProjectName === "") {

         res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectName Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;

    }
    if (req.body.Price === undefined || req.body.Price === null || req.body.Price === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Price Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;


    }
    if (req.body.Benefits === undefined || req.body.Benefits === null || req.body.Benefits === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Benefits Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;

    }
    if (req.body.Description === undefined || req.body.Description === null || req.body.Description === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Description Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;

    }
    if (req.body.Location === undefined || req.body.Location === null || req.body.Location === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Location Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;

    }



    console.log(req.files);

    fs.mkdir(`./public/uploads/${ProID}`);
    for (var i = 0; req.files !== undefined && i < req.files.length; i++) {
        fs.rename(`./public/uploads/${req.files[i].originalname}`, `./public/uploads/${ProID}/${req.files[i].originalname}`);
    }


    req.db.query(`INSERT INTO projects (ProjectName , Price , Benefits , Description ,Location ,  Project_ID) VALUES (?) `, [body], (error, results) => {
        if (error) {
            
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
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": "Project Added Successfully."
        });
        return next()  ;

    });


}


exports.edit_projects = (req, res , next) => {
    let body = [];

    body.push();

    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }
    if (req.body.ProjectName === undefined || req.body.ProjectName === null || req.body.ProjectName === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectName Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }
    if (req.body.Price === undefined || req.body.Price === null || req.body.Price === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Price Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;

    }
    if (req.body.Benefits === undefined || req.body.Benefits === null || req.body.Benefits === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Benefits Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;

    }
    if (req.body.Description === undefined || req.body.Description === null || req.body.Description === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Description Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;

    }
    if (req.body.Location === undefined || req.body.Location === null || req.body.Location === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Location Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;

    }


    req.db.query('UPDATE projects SET ProjectName = ? , Price= ? , Benefits = ?  , Description = ? , Location = ? WHERE Project_ID = ?', [req.body.ProjectName, req.body.Price, req.body.Benefits, req.body.Description, req.body.Location, req.body.ProjectID], (error, results) => {
        if (error) {

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
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": "Project Changed Successfully."
        });
        return next()  ;

    });




}

exports.delete_projects = (req, res , next) => {

    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;

    }



    rimraf(`./public/uploads/${req.body.ProjectID}`, function () {
        console.log('done');
    });


    req.db.query('DELETE FROM projectunits WHERE Project_ID = ?', [req.body.ProjectID], (error, results) => {
        if (error) {

             res.send({
                "IsSuccess": false,
                "ErrorMessage": error,
                "StatusCode": 500,
                "Response": ""
            });
            return next()  ;
        }


    });
    req.db.query(`DELETE FROM projectvideos WHERE Project_ID = ? `, [req.body.ProjectID], (error, results) => {
        if (error) {

            res.send({
                "IsSuccess": false,
                "ErrorMessage": error,
                "StatusCode": 500,
                "Response": ""
            });
            return next()  ;
        }


    });


    req.db.query('DELETE FROM projects WHERE Project_ID = ?', [req.body.ProjectID], (error, results) => {
        if (error) {

             res.send({
                "IsSuccess": false,
                "ErrorMessage": error,
                "StatusCode": 500,
                "Response": ""
            });
            return next()  ;
        }

        var ResponseMessage;
        if (results.affectedRows === 0)
            ResponseMessage = "Not Valid ID."
        else
            ResponseMessage = "Project Deleted Successfully."

        res.send({
            "IsSuccess": true,
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": ResponseMessage
        });
        return next()  ;
    });

}

exports.add_unit = (req, res , next) => {
    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }

    if (req.body.UnitType === undefined || req.body.UnitType === null || req.body.UnitType === "" ||
        req.body.Price === undefined || req.body.Price === null || req.body.Price === "" ||
        req.body.Area === undefined || req.body.Area === null || req.body.Area === "" ||
        req.body.Finishing === undefined || req.body.Finishing === null || req.body.Finishing === "" ||
        req.body.DeliveryDate === undefined || req.body.DeliveryDate === null || req.body.DeliveryDate === "" ||
        req.body.PaymentTerms === undefined || req.body.PaymentTerms === null || req.body.PaymentTerms === "" ||
        req.body.Location === undefined || req.body.Location === null || req.body.Location === "" ||
        req.body.Status === undefined || req.body.Status === null || req.body.Status === "" ||
        req.body.UnitTitle === undefined || req.body.UnitTitle === null || req.body.UnitTitle === "" ||
        req.body.Bedrooms === undefined || req.body.Bedrooms === null || req.body.Bedrooms === "" ||
        req.body.Bathrooms === undefined || req.body.Bathrooms === null || req.body.Bathrooms === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Units Elements Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }


    let UID = uniqid();
    let Unit = [];
    Unit.push(UID, req.body.UnitType, req.body.Price, req.body.Area, req.body.Finishing, req.body.DeliveryDate, req.body.PaymentTerms, req.body.UnitTitle, req.body.Status, req.body.Location, req.body.Bedrooms, req.body.Bathrooms, req.body.ProjectID);
    req.db.query(`INSERT INTO projectunits (UnitID , UnitType , Price , Area, Finishing,  DeliveryDate, PaymentTerms , UnitTitle , Status , Location , Bedrooms ,Bathrooms , Project_id) VALUES (?) `, [Unit], (error, results) => {
        if (error) {

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
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": "Unit Added Successfully."
        });
        return next()  ;

    });






}

exports.edit_unit = (req, res , next) => {
    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }

    if (req.body.UnitType === undefined || req.body.UnitType === null || req.body.UnitType === "" ||
        req.body.UnitID === undefined || req.body.UnitID === null || req.body.UnitID === "" ||
        req.body.Price === undefined || req.body.Price === null || req.body.Price === "" ||
        req.body.Area === undefined || req.body.Area === null || req.body.Area === "" ||
        req.body.Finishing === undefined || req.body.Finishing === null || req.body.Finishing === "" ||
        req.body.DeliveryDate === undefined || req.body.DeliveryDate === null || req.body.DeliveryDate === "" ||
        req.body.PaymentTerms === undefined || req.body.PaymentTerms === null || req.body.PaymentTerms === "" ||
        req.body.Location === undefined || req.body.Location === null || req.body.Location === "" ||
        req.body.Status === undefined || req.body.Status === null || req.body.Status === "" ||
        req.body.UnitTitle === undefined || req.body.UnitTitle === null || req.body.UnitTitle === "" ||
        req.body.Bedrooms === undefined || req.body.Bedrooms === null || req.body.Bedrooms === "" ||
        req.body.Bathrooms === undefined || req.body.Bathrooms === null || req.body.Bathrooms === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "Units Elements Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }

    req.db.query(`UPDATE projectunits SET  UnitType = ? , Price = ? , Area = ?, Finishing = ?,  DeliveryDate = ?, PaymentTerms = ? , UnitTitle  = ?, Status = ? , Location = ? , Bedrooms = ?,Bathrooms =? WHERE  Project_id = ? AND UnitID = ? `, [req.body.UnitType, req.body.Price, req.body.Area, req.body.Finishing, req.body.DeliveryDate, req.body.PaymentTerms, req.body.UnitTitle, req.body.Status, req.body.Location, req.body.Bedrooms, req.body.Bathrooms, req.body.ProjectID, req.body.UnitID], (error, results) => {
        if (error) {

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
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": "Unit Changed Successfully."
        });
        return next()  ;

    });

}

exports.delete_unit = (req, res , next) => {

    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {

        res.send({

            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }

    if (req.body.UnitID === undefined || req.body.UnitID === null || req.body.UnitID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "UnitID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }

    req.db.query('DELETE FROM projectunits WHERE Project_ID = ? AND UnitID = ?', [req.body.ProjectID, req.body.UnitID], (error, results) => {
        if (error) {

            res.send({
                "IsSuccess": false,
                "ErrorMessage": error,
                "StatusCode": 500,
                "Response": ""
            });
            return next()  ;
        }

        var ResponseMessage;
        if (results.affectedRows === 0)
            ResponseMessage = "Not Valid ID."
        else
            ResponseMessage = "Unit Deleted Successfully."

        res.send({
            "IsSuccess": true,
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": ResponseMessage
        });
        return next()  ;


    });

}

exports.get_project_details = (req, res , next) => {

    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {

         res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }

    let projects, images;

    req.db.query("SELECT * FROM projects WHERE Project_ID = ?", [req.body.ProjectID], (error, results, fields) => {

        if (error) {

            res.send({
                "IsSuccess": false,
                "ErrorMessage": error,
                "StatusCode": 500,
                "Response": ""
            });
            return next()  ;
        }


        project = results;
    });

    req.db.query("SELECT * FROM projectunits WHERE Project_ID= ?", [req.body.ProjectID], (error, results, fields) => {
        let all = [];
        if (error) {

            res.send({
                "IsSuccess": false,
                "ErrorMessage": error,
                "StatusCode": 500,
                "Response": ""
            });
            return next()  ;
        }



        for (var i = 0; project !== undefined && i < project.length; i++) {
            var PImgs = [];
            var PU = [];
            images = fs.readdirSync(`public/uploads/${project[i].Project_ID}`);

            for (var j = 0; j < images.length; j++) {
                PImgs.push({
                    'ImageUrl': `http://yakensolution.cloudapp.net:4000/uploads/${project[i].Project_ID}/${images[j]}`
                });
            }

            for (var j = 0; j < results.length; j++) {
                if (project[i].Project_ID === results[j].Project_ID) {
                    PU.push({
                        "UnitID": results[j].UnitID,
                        "UnitType": results[j].UnitType,
                        "UnitTitle": results[j].UnitTitle,
                        "UnitPrice": results[j].Price,
                        "UnitArea": results[j].Area,
                        "UnitFinishing": results[j].Finishing,
                        "UnitDeliveryDate": results[j].DeliveryDate,
                        "UnitPaymentTerms": results[j].PaymentTerms,
                        "UnitLocation": results[j].Location,
                        "UnitStatus": results[j].Status,
                        "UnitBathrooms": results[j].Bathrooms,
                        "UnitBedrooms": results[j].Bedrooms,

                    });

                }
            }


            all.push({
                "ProjectID": project[i].Project_ID,
                "ProjectName": project[i].ProjectName,
                "ProjectPrice": project[i].Price,
                "ProjectBenefits": project[i].Benefits,
                "ProjectDescription": project[i].Description,
                "ProjectImages": PImgs,
                "ProjectUnits": PU,
                "ProjectLocation": project[i].Location,


            });

        }

        res.send({
            "IsSuccess": true,
            "ErrorMessage": "",
            "StatusCode": 200,
            "Response": all
        });
        return next()  ;


    });

}


exports.get_unit_details = (req, res , next) => {

    let Unit = [];
    let type , id ;


    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {

         res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }

    if (req.body.UnitID === undefined || req.body.UnitID === null || req.body.UnitID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "UnitID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }


    req.db.query("SELECT * FROM projectunits WHERE Project_ID = ? AND UnitID = ?", [req.body.ProjectID, req.body.UnitID], (error, results, fields) => {
        if (error) {

            res.send({
                "IsSuccess": false,
                "ErrorMessage": error,
                "StatusCode": 500,
                "Response": ""
            });
            return next()  ;
        }
        Unit = results;
        if(Unit !== undefined){
            
        type = Unit[0].UnitType;
        id = Unit[0].UnitID;
        
        }
       // console.log(Unit);
        req.db.query(`SELECT * FROM projectunits WHERE UnitType = ? AND UnitID != ?`,[type , id] ,  (error, results, fields) => {
        let PU = [];
        let PRU = [];
      // console.log(type);

       // console.log(results); 

        if (error) {

            res.send({
                "IsSuccess": false,
                "ErrorMessage": error,
                "StatusCode": 500,
                "Response": ""
            });
            return next()  ;
        }


        for (var j = 0; results !== undefined && j < results.length; j++) {

            PRU.push({
                "UnitID": results[j].UnitID,
                "UnitType": results[j].UnitType,
                "UnitTitle": results[j].UnitTitle,
                "UnitPrice": results[j].Price,
                "UnitArea": results[j].Area,
                "UnitFinishing": results[j].Finishing,
                "UnitDeliveryDate": results[j].DeliveryDate,
                "UnitPaymentTerms": results[j].PaymentTerms,
                "UnitLocation": results[j].Location,
                "UnitStatus": results[j].Status,
                "UnitBathrooms": results[j].Bathrooms,
                "UnitBedrooms": results[j].Bedrooms,
                "ProjectID" : results[j].Project_ID

            }) ; 

        }
        for(var j= 0 ; Unit !== undefined && j<Unit.length ; j++){
            PU = {
                "UnitID": Unit[j].UnitID,
                "UnitType": Unit[j].UnitType,
                "UnitTitle": Unit[j].UnitTitle,
                "UnitPrice": Unit[j].Price,
                "UnitArea": Unit[j].Area,
                "UnitFinishing": Unit[j].Finishing,
                "UnitDeliveryDate": Unit[j].DeliveryDate,
                "UnitPaymentTerms": Unit[j].PaymentTerms,
                "UnitLocation": Unit[j].Location,
                "UnitStatus": Unit[j].Status,
                "UnitBathrooms": Unit[j].Bathrooms,
                "UnitBedrooms": Unit[j].Bedrooms,
                "RelatedUnits": PRU,
                
    
            };
            
        }
        


        res.send({
            "IsSuccess": true,
            "ErrorMessage": "",
            "StatusCode": 200,
            "Response": PU
        });
        return next()  ;
        
        


        });


    });
    


}


exports.add_image_project = (req, res , next) => {
    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }
    for (var i = 0; req.files !== undefined && i < req.files.length; i++) {
        fs.rename(`./public/uploads/${req.files[i].originalname}`, `./public/uploads/${req.body.ProjectID}/${req.files[i].originalname}`);
    }

    res.send({
        "IsSuccess": true,
        "ErrorMessage": null,
        "StatusCode": 200,
        "Response": "Image Added Successfully."
    });
    return next()  ;


}

exports.delete_image_project = (req, res , next) => {
    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }
    if (req.body.ImageName === undefined || req.body.ImageName === null || req.body.ImageName === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }

    fs.unlink(`./public/uploads/${req.body.ProjectID}/${req.body.ImageName}`);

    res.send({
        "IsSuccess": true,
        "ErrorMessage": null,
        "StatusCode": 200,
        "Response": "Image Deleted Successfully."
    });
    return next()  ;




}

exports.add_video_project = (req, res , next) => {


    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }
    if (req.body.VideoTitle === undefined || req.body.VideoTitle === null || req.body.VideoTitle === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "VideoTitle Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }
    if (req.body.VideoUrl === undefined || req.body.VideoUrl === null || req.body.VideoUrl === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "VideoUrl Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }

    let body = [];
    let VID = uniqid();

    body.push(VID, req.body.VideoTitle, req.body.VideoUrl, req.body.ProjectID);

    req.db.query(`INSERT INTO projectvideos (VideoID , VideoTitle , VideoUrl , Project_ID) VALUES (?) `, [body], (error, results) => {
        if (error) {

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
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": "Video Added Successfully."
        });
        return next()  ;


    });




}

exports.delete_video_project = (req, res , next) => {
    if (req.body.ProjectID === undefined || req.body.ProjectID === null || req.body.ProjectID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ProjectID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }
    if (req.body.VideoID === undefined || req.body.VideoID === null || req.body.VideoID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "VideoID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }

    req.db.query(`DELETE FROM projectvideos WHERE Project_ID = ? AND VideoID = ?  `, [req.body.ProjectID, req.body.VideoID], (error, results) => {
        if (error) {

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
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": "Video Deleted Successfully."
        });
        return next()  ;

    });




}
