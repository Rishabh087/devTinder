const express =  require("express") ; 

const requestRouter =  express.Router() ; 

const {userAuth} = require("./../middlewares/auth") ;

requestRouter.post("/sendConnectionRequest" , userAuth , async(req , res) =>{
 try {
        const user = req.user ;
        console.log("Connection sent")
        res.send(user.firstName + " sent a connection request!")
    } catch (error) {
        res.status(400).send("Unable to send request!")
    }
  
})

module.exports = requestRouter ; 