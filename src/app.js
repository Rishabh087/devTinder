const express =  require("express")  ;
const {userAuth} = require("./middlewares/auth") ;
const {connectDb} = require("./config/database")
const User  = require("./models/user")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const app =  express() ;
const cors = require("cors")

// app.use(()=>{})  this will work for all the routes and http methods 
// to access the req.body we need middle ware which will convert the json inti js object and give it in body 
app.use(cors({
    origin : "http://localhost:5173" , 
    credentials : true 
}))
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

const authRouter = require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/requests.js")
const useRouter = require("./routes/user.js");

app.use("/" , authRouter) ; 
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , useRouter ) ;

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