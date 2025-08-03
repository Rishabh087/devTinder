const mongoose  = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        required : true ,
    } ,
gender: {
  type: String,
  required: true,
 validate: {
  validator: (value) => ["Male", "Female", "Others"].includes(value),
  message: "Gender is not valid"
}
,
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
userSchema.methods.getJWT = async function () {
    const user = this 
    const token = await  jwt.sign({_id : user._id} , "Qwerty@12345" , {expiresIn : "7d"})
    return token ;
}
userSchema.methods.validatePassword =  async function (passwordInputByUser) {

    const user = this ;
    const hashedPassword = user.passWord ;
    const  isValid = await bcrypt.compare(passwordInputByUser , hashedPassword) ;  
    return isValid ;
}
// const userModel = mongoose.model("User" , userSchema) ;
// module.exports = userModel ;
//   OR   //   model is like a class 
module.exports = mongoose.model("User" , userSchema ) ;