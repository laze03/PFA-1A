const express = require("express");
const PORT = 5000;
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());

// app.post("/api", (req, res) => {
//   const filename = Date.now() + "_" + req.files.file.name;
//   const file = req.files.file;
//   let uploadPath = __dirname + "/uploads/" + filename;
//   file.mv(uploadPath, (err) => {
//     if (err) {
//       return res.send(err);
//     }
//   });
//   res.send(uploadPath);
// });

app.post("/api", (req, res) => {
  const filename = Date.now() + "_" + req.files.file.name;
  const file = req.files.file;
  let uploadPath = __dirname + "/uploads/" + filename;
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.send(err);
    }
  });
  const pyProg = spawn("python", [
    __dirname + "/python/JSON_distribution_par_chromosome.py",
    uploadPath,
  ]);
  pyProg.stdout.on("data", function (data) {
    console.log("stdout: " + data.toString());
    res.send(data.toString());
  });
  pyProg.stderr.on("data", (data) => {
    console.log("stderr: " + data.toString());
  });
  pyProg.on("close", (code) => {
    console.log("child process exited with code " + code.toString());
  });
  // res.send(uploadPath);
});

app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2"] });
});

app.listen(PORT, () => console.log(`start listening on port : ${PORT}`));
