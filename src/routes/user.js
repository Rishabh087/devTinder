const express = require("express") ;
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { connections } = require("mongoose");
const userRouter = express.Router() ;
const User = require("./../models/user")

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


userRouter.get("/feed" , userAuth , async(req , res) =>{
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit  = limit > 50 ? 50 : limit ;
        const skip = (page-1)*limit ;
        const logedInUser = req.user ;
        const connectionRequest = await ConnectionRequest.find({
            $or : [
                {fromUserId : logedInUser._id } ,
                {toUserId : logedInUser._id   }
            ]}).select("fromUserId toUserId")

            const hideUsersFromFeed =  new Set() ;
            connectionRequest.forEach((req) => {
                hideUsersFromFeed.add(req.fromUserId.toString());
                hideUsersFromFeed.add(req.toUserId.toString());
            })
    
            const users = await User.find({
              $and :  [{_id : { $nin : Array.from(hideUsersFromFeed)}},
                      {_id  : { $ne :  logedInUser._id }}
            ],
            }).select(USER_SAFE_DATA)
              .skip(skip)
              .limit(limit)

            res.json(users);
    } catch (error) {
        res.status(400).send({message : error.message})
    }

})
     

module.exports = userRouter