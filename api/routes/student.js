const express = require("express");
const Student = require("../../model/student");
const router = express.Router();
const checkAuth = require("../../middleware/checkAuth");
const upload = require("../../middleware/multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

router.get("/", checkAuth, (req, res, next) => {
  //  res.status(200).json({
  //     msg: "this is student get request",
  //   });
  Student.find()
    .then((result) => {
      res.status(200).json({
        studentData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:pd", (req, res, next) => {
  // console.log(req.params.pd);
  Student.findById(req.params.pd)
    .then((result) => {
      console.log(result);
      res.status(200).json({
        studentData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", upload.single("image"), async (req, res, next) => {
  console.log(req.body, req.file.path);
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);
    const student = new Student({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      imagepath: result.secure_url,
    });
    student
      .save()
      .then((result) => {
        console.log(result);
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  } catch (err) {
    return res.send(err);
  }
});

//  delete request
router.delete("/:id", (req, res, next) => {
  Student.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).json({
        message: "student deleted",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// put request
// router.put("/:id", (req, res, next) => {
//   // console.log(req.params.pd);
//   student
//     .findOneAndUpdate(
//       { _id: req.params.id },
//       {
//         $set: {
//           name: req.body.name,
//           email: req.body.email,
//           phone: req.body.phone,
//           gender: req.body.gender,
//         },
//       },
//       { new: true }
//     )
//     .then((result) => {
//       console.log(result);
//       res.status(200).json({
//         studentDataUpdated: result,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

router.put("/:id", async (req, res, next) => {
  try {
    const updatedData = await Student.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          gender: req.body.gender,
          age: req.body.age,
        },
      },
      { new: true }
    );
    return res.send({
      statusCode: 200,
      data: updatedData,
      message: "data updated successfully",
    });
  } catch (err) {
    return res.send({
      statusCode: 500,
      error: err,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
