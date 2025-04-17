const express =  require("express")  ;
const {userAuth }= require("./../middlewares/auth")
const {connectDb} = require("./config/database")
const User  = require("./../models/user")

const app =  express() ;

// app.use(()=>{})  this will work for all the routes and http methods 
// to access the req.body we need middle ware which will convert the json inti js object and give it in body 

app.use(express.json());

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

console.log(req);

    const user = new User(req.body);
    // user.save() return a promise thats why async await
    await user.save() ;
    res.send("Data is added to the db sucessfully")
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


app.patch("/user" ,  async (req , res) =>{

    const userID = req.body.userId ;
    const data = req.body
    console.log(data) ; 
   const user =  await User.findByIdAndUpdate({_id : userID} , data , {returnDocument : "after"} );
    try {
        res.send("User data is updated successfully")
        console.log(user);
    } catch (error) {
        res.status(501).send("Something went wrong")
    
    }
    
})

app.listen(3000, () =>{

    console.log("Server is running on the port 3000")
   
}) ;