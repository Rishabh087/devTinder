const express =  require("express")  ;

const app =  express() ;

app.use("/" , (req , res) =>{
    res.send("hello from node js")
})
app.use("contact" , (req , res) =>{
    res.send("hello my contact is hidden")
})
app.use("name" , (req , res) =>{
    res.send("hello my name is rishabh pandey")
})
app.use("hobby" , (req , res) =>{
    res.send("hello my hobby is watching movies")
})

app.listen(3000, () =>{
    console.log("Server is running on the port 3000")
}) ;