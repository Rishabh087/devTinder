const mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String
    } ,
    lastName : {
        type : String
    } ,
    emailId : {  
        type : String
    } ,
    passWord : {
        type : String
    } ,
    age : {
        type : Number
    } ,
    gender : {
        type : String
    } ,
})
// const userModel = mongoose.model("User" , userSchema) ;
// module.exports = userModel ;
//   OR   //   model is like a class 

module.exports = mongoose.model("User" , userSchema ) ;