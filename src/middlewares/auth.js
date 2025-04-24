const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth =  async (req , res , next ) =>{
    try {
        const cookies =  req.cookies;
        const {token} = cookies ;
        if(!token){
            res.send("Token is not valid!!!")
        }
        const hasedMessage = await jwt.verify(token , "Qwerty@12345");
        const {_id} = hasedMessage ;
        const user = await  User.findById(_id);
        if(!user){
            res.send("User Not found")
        }
        req.user = user ;
        next() ;    
    } catch (error) {
        res.status(400).send(error.message);
        
    }
    
 }

 module.exports =  {
userAuth 
 } ;