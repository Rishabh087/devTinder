const express =  require("express") ; 

const requestRouter =  express.Router() ; 

const {userAuth} = require("./../middlewares/auth") ;

const ConnectionRequest = require("./../models/connectionRequest");

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
module.exports = requestRouter ; 