const mongoose = require("mongoose");
const url = process.env.MONGO_DB_URI;

mongoose
  .connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Not Connected", error));

//   mongoose.connection.on('error',err=<{
//     console.log("Connection Failed");
// })

// mongoose.connection.on('connected',connected=<{
//     console.log("Connection Succesful");
// })
