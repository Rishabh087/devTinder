const authentication =  (req , res , next ) =>{
    
    console.log("Authenticity is being checked")
    const token = "xyz" ;
    if(token === "xyz"){
        console.log("Real admi hai bhai ")
    }else{
        console.log("you are not authorised")
        res.status(401).sende("nope")
     
    }
    next() ;
 }

 module.exports =  {
 authentication 
 } ;