const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth =  async (req , res , next ) =>{
    try {
        const cookies =  req.cookies;
        const {token} = cookies ; 
        if(!token){
           return res.status(401).send("Please Login!!!")
        }
        const hasedMessage = await jwt.verify(token , process.env.JWT_SECRET);
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