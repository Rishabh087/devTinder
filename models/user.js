const mongoose  = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        maxlength : 50
    } ,
    lastName : {
        type : String ,
        maxlength : 50 
    } ,
    emailId : {  
        type : String ,
        required : true ,
        unique : true ,
        lowercase: true ,
        trim : true ,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please enter a valid email");
            }
        }
    } ,
    passWord : {
        type : String,
        minlength : 5 ,
        required : true ,
        unique : true ,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please enter a strong password");
            }
        }
    } ,
    age : {
        type : Number , 
        min : 18 ,
    } ,
    gender : {
        type : String ,
        validate(value) {
            if(!["male" , "female" , "others"].includes(value)){
                throw new Error("Gender is not valid")
            }
        }
    } ,
    skills : {
      type : [String]  
    } ,
about : {
    type : String ,
    default : "This is default about of the user"
} ,

photoUrl : {
    type : String ,
    default : "https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png" ,
    validate(value){
        if(!validator.isURL(value)){
            throw new Error("Please enter a valid URL");
        }
    }

}


} , {timestamps : true})
// const userModel = mongoose.model("User" , userSchema) ;
// module.exports = userModel ;
//   OR   //   model is like a class 

module.exports = mongoose.model("User" , userSchema ) ;