const express =  require("express") ; 

const requestRouter =  express.Router() ; 

const {userAuth} = require("./../middlewares/auth") ;

const ConnectionRequest = require("./../models/connectionRequest");
const { connect } = require("mongoose");
const User = require("./../models/user");

requestRouter.post("/request/send/:status/:userId" , userAuth , async(req , res) =>{
 try {
        const user = req.user;
        const fromUserId = req.user._id;
        const toUserId = req.params.userId ;
        const status = req.params.status ;
        const connectionRequest = new ConnectionRequest({
            fromUserId , toUserId , status
        })
   const toUser = await User.findById(toUserId) ;
   if(!toUser){
    return res.status(400).send("User not found");
   }
    const allowedStatus = ["ignored" , "interested"]

    if(!allowedStatus.includes(status)){
        return res.status(400).send("Invalid request type " + status );
    }
    
    const existingConnectionRequest = await ConnectionRequest.findOne({
       $or:[
         {fromUserId , toUserId},
         {fromUserId : toUserId , toUserId : fromUserId}
        ],
    })
    if(existingConnectionRequest){
       return  res
        .status(400)
        .send({message : "Connection request already exists!!"})
    } 
       const data =  await  connectionRequest.save() ;
         res.json({
            message : "Connection request has sent successfully" ,
            data ,
        })
    } catch (error) {
        res.status(400).send(error.message);
    } 
})

requestRouter.post("/request/review/:status/:requestId" , userAuth , async (req , res) =>{

try {
    const logedInUser  =  req.user ;  
    const {status , requestId} = req.params ;
    const allowedStatus =  ["accepted" , "rejected"]
  
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message : "Status not Allowed!!"})
    }
const connectionRequest = await ConnectionRequest.findOne({
        fromUserId : requestId,
        toUserId : logedInUser._id ,
        status : "interested", 
    }) 

    if(!connectionRequest){
        return res.status(404).json({message : "Connection request not found!!"})
    }
    connectionRequest.status = status ;   
    const data = await connectionRequest.save() ;
    res.json({message : "Connection request " + " " + status , data}) ;
    
} catch (error) {
    res.status(400).send("Error: " + error.message); 
}

})
module.exports = requestRouter ; 