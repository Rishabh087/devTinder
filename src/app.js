const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });






















// const express =  require("express")  ;
// const {connectDb} = require("./config/database")
// const app =  express() ;
// const cookieParser = require("cookie-parser")
// const cors = require("cors")
// // app.use(()=>{})  this will work for all the routes and http methods 
// // to access the req.body we need middle ware which will convert the json inti js object and give it in body 
// // require("./../src/config/database");
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   credentials: true
// }));

// app.use(express.json());
// app.use(cookieParser());

// const authRouter = require("./routes/auth")
// const profileRouter = require("./routes/profile")
// const requestRouter = require("./routes/requests")
// const useRouter = require("./routes/user");


// app.use("/" , authRouter) ; 
// app.use("/" , profileRouter);
// app.use("/" , requestRouter);
// app.use("/" , useRouter ) ;


// connectDb().then(
//     () =>{
//         console.log("Database is connected successfully")
//     }
// ).catch((err) =>{
//     console.log("Connection failed")
//     console.log(err);
// })

// app.listen(3000, () =>{
//     console.log("Server is running on the port 3000")
// }) ;