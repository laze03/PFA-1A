const express = require("express");
const PORT = 5000;
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());

app.post("/api", (req, res) => {
  const filename = Date.now() + "_" + req.files.file.name;
  const file = req.files.file;
  let uploadPath = __dirname + "/uploads/" + filename;
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.send(err);
    }
  });
  const { spawn } = require("child_process");
  const pyProg = spawn("python", [
    "./../python/JSON_distribution_par_chromosome.py",
  ]);
  res.send(uploadPath);
});

app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2"] });
});

app.listen(PORT, () => console.log(`start listening on port : ${PORT}`));
