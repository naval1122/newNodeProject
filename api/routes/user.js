const express = require("express");

const router = express.Router();
const User = require("../../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "user route working",
  });
});

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      try {
        const checkUserExist = await User.findOne({
          $or: [{ email: req.body.email }, { username: req.body.username }],
        });
        if (checkUserExist) {
          return res.send({
            status: false,
            message: "user already exist with this email/username",
          });
        }
      } catch (err) {
        return res.send({
          status: false,
          message: "Internal server error",
        });
      }
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: hash,
        usertype: req.body.usertype,
      });
      user
        .save()
        .then((result) => {
          return res.status(200).json({
            new_user: result,
          });
          console.log("hiiiiiiiiiii");
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    }
  });
});

// login

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          messsage: "user doesn't exist",
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (!result) {
          return res.status(401).json({
            message: "password didn't match",
          });
        }

        if (result) {
          const token = jwt.sign(
            {
              username: user.username,
              usertype: user.usertype,
              email: user.email,
              phone: user.phone,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: "24h",
            }
          );
          res.status(200).json({
            username: user.username,
            usertype: user.usertype,
            email: user.email,
            phone: user.phone,
            token: token,
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
      });
    });
});

module.exports = router;
