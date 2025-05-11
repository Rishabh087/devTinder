const express = require("express") ;
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { connections } = require("mongoose");
const userRouter = express.Router() ;

const USER_SAFE_DATA = "firstName lastName age gender photoUrl about skills" ;
userRouter.get("/user/requests/recieved" , userAuth , async(req , res) => {
 
    try {
        const logedInUser = req.user ;
        const connectionRequests = await ConnectionRequest.find({
            toUserId : logedInUser._id ,
            status : "interested",
        }).populate("fromUserId" , USER_SAFE_DATA )
   //    OR // .populate("fromUserId" , ["firstName" , "lastName"]);
    
        res.json({
            message : "Data fetched successfully!!",
            data : connectionRequests
        })
        
    } catch (error) {
        res.send("Something went wrong!!")
    }

})

userRouter.get("/user/connection" , userAuth , async(req , res) =>{
    try {
        const logedInUser = req.user ;
        const connectionRequests =  await ConnectionRequest.find({
            $or : [
            {toUserId : logedInUser._id , status : "accepted"} ,
            {fromUserId : logedInUser._id  , status : "accepted"}
            ]   
        }).populate("fromUserId" , USER_SAFE_DATA)
          .populate("toUserId" , USER_SAFE_DATA) ;

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === logedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId ;
        });
        res.json({data});
        
    } catch (error) {
        res.status(400).json({message : error.message})
    }
})


module.exports = userRouter