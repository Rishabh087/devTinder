const express = require("express")
const authRouter = express.Router();
const {validateSignUpData} = require("./../utils/validator")
const User  = require("./../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");


authRouter.post("/signup" ,  async (req , res ) => {
    try 
    {
    validateSignUpData(req);
    const {firstName , lastName , emailId , passWord , age , gender , skills , about , photoUrl} = req.body ;
    const password = req.body.passWord ;
    const hashedPassword = await bcrypt.hash(password , 10) ;
    const user = new User({
        firstName ,
        lastName , 
        emailId,
        passWord : hashedPassword ,
        age , 
        gender , 
        about, 
        photoUrl,
        skills

    });
     const savedUser = await user.save() ;
    const token = await  user.getJWT()
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  expires: new Date(Date.now() + 8 * 3600000)
});

   
    res.json({message : "Signup successfull" , data : savedUser })

}
 catch (error) {
    res.status(400).send(error.message);   
}
})

authRouter.post("/login" , async (req , res) =>{
    try {
        const {passWord , emailId} = req.body 
    
        const user =  await User.findOne({emailId : emailId})
    
        if(user){
            const isValid = await user.validatePassword(passWord) ;
            if(isValid){
                const token = await  user.getJWT()
                res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                expires: new Date(Date.now() + 8 * 3600000)
                });
                res.send(user)
               }
               else{
                throw new Error("Invalid Credentials!")
               }   
        } else{
         throw new  Error("Invalid Credentials!")
        }    
    } catch (error) {
       res.status(400).send(error.message);
    }
    
    })

authRouter.post("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,       // required if using HTTPS
        sameSite: "none",   // to allow cross-site cookies with frontend
        expires: new Date(0),
        path: "/"
    });
    res.send("Logout successful!!");
});


    
module.exports = authRouter 
