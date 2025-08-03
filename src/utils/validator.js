const validator = require("validator")

const validateSignUpData = (req) => {

    const {emailId , firstName , lastName , passWord} = req.body ;

    if(!firstName || !lastName ){
        throw new Error("FirstName and lastName is required")
    }

    if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }

    if(!validator.isStrongPassword(passWord)){
        throw new Error("Please enter a strong password")
    }

}

const validateProfileEditData = (req) => {
    const allowedEditFields = ["firstName" , "lastName" , "emailId" , "about" , "skills" , "photoUrl" , "gender" , "age"] ;
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
}

module.exports = {validateSignUpData , validateProfileEditData}