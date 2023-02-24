const express = require("express");
const fcl = require("@onflow/fcl");
const mongoose = require("mongoose");
const User = require("./src/models/user");
const execSync = require("child_process").execSync;
const FlowService = require("./src/flow/flow");
const getConfig = require("./config");

const app = express();
app.use(express.urlencoded({ extended: true }));

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
Get all users from mongodb
*/
app.get("/all-users", async (req, res) => {
  const allUsers = await User.find({});
  console.log(allUsers);
  res.send(allUsers);
});

/*
Get the user info
*/
app.get("/user/:id", async (req, res) => {
  let address = "";

  // Get address from mongodb
  await User.findOne({ userId: req.params.id }, (err, result) => {
    if (err) {
      throw err;
    }
    if (!result) {
      res.status(500).send("The user doesn't exsist");
      return;
    } else {
      console.log("result: ", result);
      address = result.address;
    }
  })
    .clone()
    .catch(function (err) {
      console.log(err);
    });

  console.log("address: ", address);

  // Get flow account info from address
  const account = await fcl.send([fcl.getAccount(address)]).then(fcl.decode);
  res.send(account);
});

/*
Get the create account page
*/
app.get("/create-account", async (req, res) => {
  res.sendFile(__dirname + "/src/test/createAccount.html");
});

/*
Create account
*/
app.post("/create-account", async (req, res) => {
  console.log("req: ", req.body);

  if (!req.body) {
    return res.status(500).send("request body is empty");
  }

  // Generate key using flow cli through execSync
  //  fcl doen't have the func of key generation
  const result = execSync("flow keys generate").toString().split(/\n/);
  console.log(result);
  const privateKey = result[6].replace("Private Key \t\t ", "").trim();
  const publicKey = result[7].replace("Public Key \t\t ", "").trim();
  const mnemonic = result[8].replace("Mnemonic \t\t ", "").trim();
  console.log("private:", privateKey);
  console.log("public:", publicKey);
  console.log("mnemonic:", mnemonic);
  console.log("");

  // 公開鍵でFlowアカウントを発行する
  // その時のsignerはあらかじめ作成したおいたアカウントを指定する必要がある
  const flowService = new FlowService(
    config.adminAddress,
    config.adminPrivateKeyHex,
    config.adminAccountKeyIndex
  );

  const authorization = flowService.authorize(); // 認証

  const transaction = `
  import Crypto
            
  transaction() {
    prepare(signer: AuthAccount) {
        let publicKey = PublicKey(
            publicKey: "${publicKey}".decodeHex(),
            signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
        )
        let keyList = Crypto.KeyListEntry(keyIndex:1, publicKey:publicKey, hashAlgorithm:HashAlgorithm.SHA2_256, weight:1000.0, isRevoked:true)
        let account = AuthAccount(payer: signer)
        // add all the keys to the account
        account.keys.add(publicKey: keyList.publicKey, hashAlgorithm: keyList.hashAlgorithm, weight: keyList.weight)
        log(account)
    }
}
  `;

  const txResult = await flowService.sendTx({
    transaction,
    args: [],
    authorizations: [authorization],
    payer: authorization,
    proposer: authorization,
  });

  console.log("transaction result: ", txResult);

  let assignedAddress = "";
  txResult.events.map((event) => {
    console.log(event.data);
    if (event.type == "flow.AccountCreated") {
      assignedAddress = event.data.address;
    }
  });

  // Save account info to mongodb
  // TODO: Store the private key in a secure place like GCP Secret Manager
  // For develop, store keys in mongodb
  const userInstance = new User();
  userInstance.userId = req.body.userId;
  userInstance.address = assignedAddress;
  userInstance.privateKey = privateKey;
  userInstance.publicKey = publicKey;
  userInstance.mnemonic = mnemonic;

  userInstance.save((err) => {
    if (!err) {
      console.log("user create success: ", assignedAddress);
    } else {
      console.log("user create faild: ");
      console.log(err);
    }
  });

  res.sendFile(__dirname + "/src/test/createAccount.html");
});

app.get("/", (req, res) => {
  res.send("helloooo");
});

app.listen(config.port, () => {
  console.log("Listening Server...");
});
