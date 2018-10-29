
exports.get_all_services = (req , res ) => {
    let companies ; 
    req.db.query("SELECT * FROM companies" ,  (error , results , fields) => {
        
        if(error) res.send({"IsSuccess" : false , "ErrorMessage" : error , "StatusCode" : 400 , "Response": "" })  ; 
       
        companies = results ; 
     }) ; 


     req.db.query("SELECT * FROM services" ,  (error , results , fields) => {
        if(error) res.send({"IsSuccess" : false , "ErrorMessage" : error , "StatusCode" : 400 , "Response": "" })  ; 
        let all = []  ;
        for(var i = 0 ; i<companies.length ; i++){
        
            var CN = companies[i].CompanyName ;
            var CID = companies[i].CompanyID ;
            var CS = [] ; 
            for(var j = 0 ; j < results.length ; j++){
                if(CID === results[j].Company_ID){
                    CS.push({
                        "ServiceID": results[j].ServiceID , 
                        "ServiceName": results[j].ServiceName ,  
                        "ServiceDesc" : results[j].ServiceDesc      
                    }); 
                }
            }
            all.push({
                "CompanyID" : CID  , 
                "CompanyName" : CN , 
                "CompanyServices" : CS 
            }) ; 
             
        }
        res.send({"IsSuccess" : true, "ErrorMessage" :"" ,"StatusCode":200 , "Response" : all}) ; 
     
     }) ; 


     
    } 
