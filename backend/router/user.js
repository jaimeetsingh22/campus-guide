// creating the user router

import { Router } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";

const router = Router();

router.post("/new-user", async (req, res) => {
  try {
    console.log("something data: ", req.body);
    const { name, email, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedpassword });
    res.status(200).json({
      status: "success",
      message: "user created successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/user", async (req, res) => {
  try {
    const { email, password: userPassword } = req.body;
    const user = await User.find({ email });
    if (user) {
      const unhashedPassword = await bcrypt.compare(
        userPassword,
        user[0].password
      );
      console.log(unhashedPassword);
      res.status(200).json({
        status: "success",
        data: user,
        craked: unhashedPassword,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

export { router };
