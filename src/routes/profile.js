const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("./../middlewares/auth");
const { validateProfileEditData } = require("./../utils/validator");

// CORS Preflight handler for PATCH
profileRouter.options("/profile/edit", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204); // No Content
});

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Not authorised");
  }
});

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Not authorised");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;






























// const express = require("express") ;
// const profileRouter =  express.Router() ;
// const {userAuth} = require("./../middlewares/auth") ;
// const {validateProfileEditData} = require("./../utils/validator")


// profileRouter.get("/profile"  , userAuth ,  async (req , res) =>{

//     try {
//         const user = req.user 
//         res.send(user)
//     } 
//     catch (error) {
//         res.status(400).send("Not authorised")
//     }
// })

// profileRouter.get("/profile/view"  , userAuth ,  async (req , res) =>{

//     try {
//         const user = req.user 
//         res.send(user)
//     } 
//     catch (error) {
//         res.status(400).send("Not authorised")
//     }
// })

// profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
//   try {
//     if (!validateProfileEditData(req)) {
//       throw new Error("Invalid Edit Request");
//     }

//     const loggedInUser = req.user;

//     Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

//     await loggedInUser.save();

//     res.json({
//       message: `${loggedInUser.firstName}, your profile updated successfuly`,
//       data: loggedInUser,
//     });
//   } catch (err) {
//     res.status(400).send("ERROR : " + err.message);
//   }
// });

// module.exports = profileRouter;