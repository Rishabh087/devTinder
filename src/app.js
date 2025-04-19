const express =  require("express")  ;
const {userAuth }= require("./../middlewares/auth")
const {connectDb} = require("./config/database")
const User  = require("./../models/user")
const {validateSignUpData} = require("./../src/utils/validator")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app =  express() ;

// app.use(()=>{})  this will work for all the routes and http methods 
// to access the req.body we need middle ware which will convert the json inti js object and give it in body 

app.use(express.json());
app.use(cookieParser())

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

    try 
    {
    validateSignUpData(req);
    // user.save() return a promise thats why async await
    const {firstName , lastName , emailId , passWord} = req.body ;
    const password = req.body.passWord ;
    const hashedPassword = await bcrypt.hash(password , 10) ;
    const user = new User({
        firstName ,
        lastName , 
        emailId,
        passWord : hashedPassword ,

    });
   
    await user.save() ;
    res.send("Signup successfull")  
}
 catch (error) {
    res.status(400).send(error.message);   
}
  
})

app.post("/login" , async (req , res) =>{
try {
   
    const {passWord , emailId} = req.body 

    const user =  await User.findOne({emailId : emailId})
    
    if(user){
        const  isValid = await bcrypt.compare(passWord , user.passWord) ;
        if(isValid){
            const token = await  jwt.sign({_id : user._id} , "Qwerty@12345")
            res.cookie("token" , token)
            res.send("Logged in successfully!!")
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

app.get("/profile" , async(req , res) =>{

    try {
        const cookie = req.cookies
        const {token} = cookie ;
        const hasedMessage = await  jwt.verify( token , "Qwerty@12345")
        const {_id} = hasedMessage
        const userlog = await User.findById(_id);  
        res.send(userlog)
    } catch (error) {
        res.status(400).send("not genrated")
    }

})

app.get("/user" , async (req , res ) => {
    const userEmail = req.body.emailId ;
    const users = await User.findOne({emailId : userEmail}) ;  
    try{
        if(users.length === 0 ){
            res.send("There is no user with this emailId")
        }else{
            res.send(users);
            console.log("Here it is ")
        }      
    }
     catch (error) {
        res.status(404).send("Not Found")
        
    }

})
app.get("/feed" , async (req , res ) => {

    const users = await User.find({}) ;  
    try{
        if(users.length === 0 ){
            res.send("There is no user with this emailId")
        }else{
            res.send(users);
            console.log("Hrer is your feed !!! explore")
        }      
    }
     catch (error) {
        res.status(404).send("Not Found")
        
    }
    
})

app.delete("/user" , async (req , res) =>{
    const userEmail =  req.body.emailId

    const del_item  = await User.findOneAndDelete({emailId : userEmail })
    //similarly we can use  findByIdAndDelete(userEmail) or findByIdAndDelete(_id : userEmail)
    
    try {
        console.log(del_item);
        res.send("Deleted seccessfully!")
        
    } catch (error) {
        res.send("Something went wrong")
        
    }
})
app.patch("/user/:userId" ,  async (req , res) =>{

    const userID = req.params?.userId ;
    const data = req.body
   try {

    const user =  await User.findByIdAndUpdate({_id : userID} , data , {returnDocument : "after" , runValidators : true} );

    const IS_ALLOWED = ["photoUrl" , "skills" , "about"  , "gender" , "age" ]

    const is_valid =  Object.keys(data).every((k) => IS_ALLOWED.includes(k))

    if(!is_valid){
        throw new Error("You can not update this field")
    }

    if(data?.skills.length > 15){
        throw new Error("You can add upto 15 skills")
    }

    if(data?.about.length > 1000){
        throw new Error("Maximum characters can not be more than 1000")
    }

    res.send("Updated successfully!")
        
} catch (error) {
        res.status(400).send("Updation failed with:" + error.message) ;
    
    }
    
})

app.listen(3000, () =>{

    console.log("Server is running on the port 3000")
   
}) ;