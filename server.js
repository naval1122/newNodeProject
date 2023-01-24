require("dotenv").config();

const express = require("express");
const db = require("./dbConnection");
const PORT = process.env.PORT;
const app = express();
const studentRoute = require("./api/routes/student");
const facultyRoute = require("./api/routes/faculty");
const userRoute = require("./api/routes/user");

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/student", studentRoute);
app.use("/faculty", facultyRoute);
app.use("/user", userRoute);

// app.use((req, res, next) => {
//   res.status(200).json({
//     message: "app is running",
//   });
// });

app.listen(PORT, "127.0.0.1", () =>
  console.log(`server is listening at port ${PORT}`)
);

app.use((req, res, next) => {
  res.status(404).json({
    error: "bad request",
  });
});
