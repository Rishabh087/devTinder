const User = require(".././models/user")
const mongoose = require("mongoose") ;
const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "User" ,
    required : true,
   
    },
    toUserId :
    {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User" ,
    required : true,
    } ,
    status : {
    type : String ,
    required : true,
    enum : {
        values:["ignored" , "interested" , "rejected" , "accepted"] ,
        message : `{VALUE} is incorrect status type`
    }
    }

} , {timestamps : true }) ;

connectionRequestSchema.index({fromUserId : 1 , toUserId : 1}) ;

connectionRequestSchema.pre("save" , function(next){
    const connectionRequest = this ;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot make connection request to yourself!!");
    }
    next() ;
 });
const ConnectionRequestModel = new mongoose.model("ConnectionRequest" , connectionRequestSchema);
module.exports = ConnectionRequestModel ; 