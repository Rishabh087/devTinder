const express =  require("express")  ;
const {userAuth }= require("./../middlewares/auth")
const {connectDb} = require("./config/database")
const User  = require("./../models/user")

const app =  express() ;

require("./../src/config/database");

connectDb().then(
    () =>{
        console.log("Database is connected successfully")
    }
).catch((err) =>{
    console.log("Connection failed")
    console.log(err);
})

app.post("/signup" , async (req , res ) =>{



    const user = new User({
        firstName : "Naman",
        lastName : "sharma",
        emailId : "new@123",
        passWord : "123",
        age : "22",
        gender : "female",
    });
    await user.save() ;
    res.send("Data is added to the db sucessfully")
})

app.listen(3000, () =>{

    console.log("Server is running on the port 3000")
   
}) ;