const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("./../utils/validator");
const User = require("./../models/user");
const bcrypt = require("bcrypt");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
};

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, passWord, age, gender, skills, about, photoUrl } = req.body;

    const hashedPassword = await bcrypt.hash(passWord, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      passWord: hashedPassword,
      age,
      gender,
      about,
      photoUrl,
      skills,
    });

    const savedUser = await user.save();
    const token = await user.getJWT();

    res.cookie("token", token, cookieOptions);
    res.json({ message: "Signup successful", data: savedUser });

  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { passWord, emailId } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid Credentials!");

    const isValid = await user.validatePassword(passWord);
    if (!isValid) throw new Error("Invalid Credentials!");

    const token = await user.getJWT();
    res.cookie("token", token, cookieOptions);

    const { passWord: pwd, ...safeUser } = user.toObject();
    res.json(safeUser);

  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", "", {
    ...cookieOptions,
    expires: new Date(0),
  });
  res.send("Logout successful!!");
});

module.exports = authRouter;
