const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const cloudinary = require("cloudinary").v2;

router.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password, newsletter } = req.body;
    if (username) {
      const userFound = await User.findOne({ email: email });
      if (userFound === null) {
        const token = uid2(44);
        const salt = uid2(14);
        const hash = SHA256(password + salt).toString(encBase64);
        console.log(hash);
        const newUser = new User({
          email: email,
          account: {
            username: username,
            //   avatar: Object,
          },
          newsletter: newsletter,
          token: token,
          hash: hash,
          salt: salt,
        });
        await newUser.save();
        return res.json({
          _id: newUser._id,
          token: newUser.token,
          account: newUser.account,
        });
      } else {
        return res.status(400).json("email ou mot de passe incorrect");
      }
    } else {
      res.status(400).json({ error: "Username est manquant" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const newHash = SHA256(req.body.password + user.salt).toString(encBase64);
      if (newHash === user.hash) {
        return res.json({
          _id: user._id,
          token: user.token,
          account: user.account,
        });
      } else {
        return res.status(401).json({ eror: "Unauthorized" });
      }
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
