const express =  require("express")  ;

const app =  express() ;

const data = {name : "rishabh" ,
    email : "rishabh@gmail"
 }

app.get("/" , (req , res) =>{
    res.send(data);
})

app.post("/test" , (req , res) =>{
    res.send("Data is store in the Database");
})
app.put("/test" , (req , res) =>{
    res.send("Data is changed ");
})
app.delete("/test" , (req , res) =>{
    res.send("Data is deletd from the Database");
})



app.put("/test" , (req ,res) =>{


} )

app.use("/test" , (req , res) =>{
    res.send("Hello from the node js this api testing")
})

app.listen(3000, () =>{
    console.log("Server is running on the port 3000")
}) ;