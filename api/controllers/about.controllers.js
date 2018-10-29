
exports.get_about= (req , res ) => {
  let companies ; 
  req.db.query("SELECT * FROM companies" ,  (error , results , fields) => {
      
      if(error) res.send({"IsSuccess" : false , "ErrorMessage" : error , "StatusCode" : 400 , "Response": "" })  ; 
     
      companies = results ; 
   }) ; 
   req.db.query("SELECT * FROM about" ,  (error , results , fields) => {
      if(error) res.send({"IsSuccess" : false , "ErrorMessage" : error , "StatusCode" : 400 , "Response": "" })  ; 
      let all = []  ;
      for(var i = 0 ; i<companies.length ; i++){
      
          var CN = companies[i].CompanyName ;
          var CID = companies[i].CompanyID ;
          var CA = [] ; 
          for(var j = 0 ; j < results.length ; j++){
              if(CID === results[j].Company_ID){
                  CA.push({
                      "History" : results[j].History , 
                      "Mission" : results[j].Mission ,
                      "Vision"  : results[j].Vision  ,       
                  })
              }
          }
          all.push({
              "CompanyID" : CID  , 
              "CompanyName" : CN , 
              "CompanyAbout" : CA
          }) ; 
           
      }
      res.send({"IsSuccess" : true, "ErrorMessage" :"" ,"StatusCode":200 , "Response" : all}) ; 
   
   }) ; 
   
   
    
  };


  
