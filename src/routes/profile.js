const express = require("express") ;
const profileRouter =  express.Router() ;
const {userAuth} = require("./../middlewares/auth") ;
const {validateProfileEditData} = require("./../utils/validator")

profileRouter.get("/profile"  , userAuth ,  async (req , res) =>{

    try {
        const user = req.user 
        res.send(user)
    } 
    catch (error) {
        res.status(400).send("Not authorised")
    }
})

profileRouter.patch("/profile/edit" , userAuth ,  async (req , res) =>{
    try {
        if(!validateProfileEditData(req)){
          throw new Error("Invalid edit request")
        }
      const logedInUser = req.user ; 

      Object.keys(req.body).forEach((key)=> (logedInUser[key] = req.body[key]));

     await  logedInUser.save() ;

      res.json({message : `${logedInUser.firstName + " "  + logedInUser.lastName}  your profile edited successfully` 
   , data : logedInUser});

        
    } catch (error) {
        res.status(400).send(error.message);
        
    }
    
})

module.exports = profileRouter