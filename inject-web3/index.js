const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");
const User = require("./models/user");

const PORT = process.env.PORT || 5000;

// Connect MongoDB
mongoose
  .connect("mongodb://root:pass@localhost:27017/")
  .then(() => {
    console.log("Success: connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failure: Unconnected to MongoDB");
    console.log(error);
  });

app.get("/all-users", async (req, res) => {
  const allUsers = await User.find({});
  console.log(allUsers);
  res.send(allUsers);
});

app.get("/user/:id", async (req, res) => {
  let address = "";

  // Get address from mongodb
  User.findOne({ userId: req.params.id }, (err, result) => {
    if (err) {
      throw err;
    }
    if (!result) {
      res.status(500).send("The user doesn't exsist");
      return;
    } else {
      console.log(result);
      address = result.address;
    }
    console.log("address: ", address);

    // アドレスをキーにFlowアカウントの情報を取得する
    flowAccount = "hogehoge";
    res.send(flowAccount);
  });
});

app.get("/create-account", async (req, res) => {
  res.sendFile(__dirname + "/test/createAccount.html");
});

app.post("/create-account", async (req, res) => {
  console.log("req: ", req.body);

  if (!req.body) {
    return res.status(500).send("request body is empty");
  }

  // 鍵を生成する
  // 鍵ペアを厳重管理する
  // 公開鍵でFlowアカウントを発行する

  // Save mongodb
  const instance = new User();
  instance.userId = req.body.userId;
  instance.address = "0xSample";

  instance.save((err) => {
    if (!err) {
      console.log("user create success");
    } else {
      console.log("user create faild");
      console.log(err);
    }
  });

  res.sendFile(__dirname + "/test/createAccount.html");
});

app.get("/", (req, res) => {
  res.send("helloooo");
});

app.listen(PORT, () => {
  console.log("Listening Server...");
});
