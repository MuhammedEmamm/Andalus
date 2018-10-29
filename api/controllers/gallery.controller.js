var uniqid = require('uniqid');
var fs = require('fs');
var rimraf = require('rimraf');
exports.get_images_gallery = (req, res , next) => {
    let images;
    var PImgs = [];
    var Images ;
    req.db.query("SELECT * FROM galleryimages", (error, results, fields) => {
        if (error){

              res.send({
                  "IsSuccess": false,
                  "ErrorMessage": error,
                  "StatusCode": 500,
                  "Response": ""
              });
              return next()  ;

          } 
          
        Images = results ; 
        images = fs.readdirSync(`public/uploads/gallery`);

        for (var i = 0; Images !== undefined && i < Images.length; i++) {
            for (var j = 0; j < images.length; j++) {
                if (Images[i].ImageName === images[j]) {
    
                    PImgs.push({
                        'ImageID' : Images[i].ImageID,
                        'ImageTitle': Images[i].ImageTitle,
                        'ImageName': images[j],
                        'ImageUrl': `http://yakensolution.cloudapp.net:4000/uploads/gallery/${images[j]}`
                    });
                    break; 
                }
            }
    
        }
        res.send({
            "IsSuccess": true,
            "ErrorMessage": "",
            "StatusCode": 200,
            "Response": PImgs
        });
        return next()  ;
    
    });
   

}
exports.add_image_gallery = (req , res , next) => {
    
    if (req.body.ImageTitle === undefined || req.body.ImageTitle === null || req.body.ImageTitle === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ImageTitle Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }
    

    for (var i = 0; req.files !== undefined && i < req.files.length; i++) {


        fs.rename(`./public/uploads/${req.files[i].originalname}`, `./public/uploads/gallery/${req.files[i].originalname}`);
        let body = [];
        let IID = uniqid();

    body.push(IID, req.body.ImageTitle, req.files[i].originalname);

    req.db.query(`INSERT INTO galleryimages (ImageID , ImageTitle , ImageName ) VALUES (?) `, [body], (error, results) => {
        if (error){

              res.send({
                  "IsSuccess": false,
                  "ErrorMessage": error,
                  "StatusCode": 500,
                  "Response": ""
              });
              return next()  ;
          } 
          

    });
    
    }

    res.send({
        "IsSuccess": true,
        "ErrorMessage": null,
        "StatusCode": 200,
        "Response": "Image Added Successfully."
    });
    return next()  ;
    
    
}
exports.delete_image_gallery = (req , res , next) => {
    if (req.body.ImageID === undefined || req.body.ImageID === null || req.body.ImageID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ImageID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }
    if (req.body.ImageName === undefined || req.body.ImageName === null || req.body.ImageName === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "ImageName Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }
    
    fs.unlink(`./public/uploads/gallery/${req.body.ImageName}`); 
    
    req.db.query(`DELETE FROM galleryimages WHERE  AND ImageID = ?  `, [req.body.ImageID], (error, results) => {
        if (error){

              res.send({
                  "IsSuccess": false,
                  "ErrorMessage": error,
                  "StatusCode": 500,
                  "Response": ""
              });
              return next()  ;
          } 
          
        

    });

    res.send({
        "IsSuccess": true,
        "ErrorMessage": null,
        "StatusCode": 200,
        "Response": "Image Deleted Successfully."
    });
    return next()  ;
    
}




exports.get_videos_gallery = (req, res , next) => {
    let Videos = []; 
    
    req.db.query("SELECT * FROM galleryvideos" ,(error , results , fields) => {
        if (error){

              res.send({
                  "IsSuccess": false,
                  "ErrorMessage": error,
                  "StatusCode": 500,
                  "Response": ""
              });
              return next()  ;
          } 
          
        else {
            for(var i = 0 ;results !== undefined &&   i<results.length ; i++){
                Videos.push({
                    "VideoID" : results[i].VideoID , 
                    "VideoTitle" : results[i].VideoTitle, 
                    "VideoUrl" : results[i].VideoUrl, 
                    
                }) ; 
            }

            res.send({
                "IsSuccess": true,
                "ErrorMessage": "",
                "StatusCode": 200,
                "Response": Videos
            });
            return next()  ; 
        }
      
    }) ;
            
           
            
}
exports.add_video_gallery = (req , res , next) => {

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

    body.push(VID, req.body.VideoTitle, req.body.VideoUrl);

    req.db.query(`INSERT INTO galleryvideos (VideoID , VideoTitle , VideoUrl) VALUES (?) `, [body], (error, results) => {
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
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": "Video Added Successfully."
        });
        return next()  ;


    });



    
}
exports.delete_video_gallery = (req , res) => {
    
    if (req.body.VideoID === undefined || req.body.VideoID === null || req.body.VideoID === "") {

        res.send({
            "IsSuccess": false,
            "ErrorMessage": "VideoID Can't Be Null",
            "StatusCode": 500,
            "Response": ""
        });
        return next()  ;
    }

    req.db.query(`DELETE FROM galleryvideos WHERE VideoID = ?  `, [req.body.VideoID ], (error, results) => {
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
            "ErrorMessage": null,
            "StatusCode": 200,
            "Response": "Video Deleted Successfully."
        });
        return next()  ;

    });


    
    
}

