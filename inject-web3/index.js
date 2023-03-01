const express = require("express");
const cors = require("cors");
const fcl = require("@onflow/fcl");
const mongoose = require("mongoose");
const User = require("./src/models/user");
const getConfig = require("./config");

const { getUser } = require("./src/db/getData");
const createAccount = require("./src/api/createAccount");
const mintNFT = require("./src/api/mintNFT");
const getNFT = require("./src/api/getNFT");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const config = getConfig();

/*
Connect MongoDB
*/
mongoose
  .connect(config.mongodbUrl)
  .then(() => {
    console.log("Success: connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failure: Unconnected to MongoDB");
    console.log(error);
  });

/*
FCL Configuration
*/
fcl.config({
  "accessNode.api": config.accessApi,
});

/*
API
*/

/*
Get a sample page
*/
app.get("/test", async (req, res) => {
  res.sendFile(__dirname + "/src/test/test.html");
});

/*
Get all users from mongodb
*/
app.get("/users-all", async (req, res) => {
  const allUsers = await User.find({});
  res.json(allUsers);
});

/*
Get the user info
*/
app.get("/users/:id", async (req, res) => {
  // Get user data from mongodb
  const user = await getUser(req.params.id);

  if (user) {
    // Get flow account info from address
    const account = await fcl
      .send([fcl.getAccount(user.address)])
      .then(fcl.decode);
    res.send(account);
  } else {
    res.status(500).send("The user doesn't exsist");
  }
});

/*
Get user's nfts 
*/
app.get("/users/:id/nft", async (req, res) => {
  // Get user data from mongodb
  const user = await getUser(req.params.id);

  if (user) {
    // Get nfts from user address
    let nfts = await getNFT(user.address);

    res.json({ userHash: user.userHash, address: user.address, nfts: nfts });
  } else {
    res.status(500).send("The user doesn't exsist");
  }
});

/*
Create account
*/
app.post("/users", async (req, res) => {
  if (!req.body) {
    return res.status(500).send("request body is empty");
  }

  const { address, err } = await createAccount(req.body.userHash);

  if (err) {
    res.status(500).json({ message: "Failed: can't create user", err: err });
  } else {
    res.json({ address: address });
  }
});

/*
Mint NFT
*/
app.post("/nfts", async (req, res) => {
  if (!req.body) {
    return res.status(500).send("request body is empty");
  }

  const userHash = req.body.userHash;
  const name = req.body.name;
  const description = req.body.description;
  const thumbnail = req.body.thumbnail;
  const metadata = req.body.metadata;

  const user = await getUser(userHash);

  if (user) {
    const result = await mintNFT(
      user.address,
      name,
      description,
      thumbnail,
      metadata
    );
    res.json(result);
  } else {
    res.status(500).send("user does not exist");
  }
});

app.get("/", (req, res) => {
  res.send("helloooo");
});

app.listen(config.port, () => {
  console.log("Listening Server...");
});
