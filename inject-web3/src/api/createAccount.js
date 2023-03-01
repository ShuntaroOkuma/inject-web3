const User = require("../models/user");
const execSync = require("child_process").execSync;
const FlowService = require("../flow/flow");
const getConfig = require("../../config");
const { findOne } = require("../models/user");

const config = getConfig();

async function createAccount(userHash) {
  let err = "";

  if (!userHash) {
    err = `userHash is not set`;
    return { address: undefined, err: err };
  }

  // Check userHash existence in db
  const existingUser = await User.findOne(
    { userHash: userHash },
    (err, result) => {
      if (err) {
        throw err;
      }
      return result;
    }
  )
    .clone()
    .catch(function (err) {
      console.log(err);
    });

  if (existingUser) {
    if (existingUser.userHash === userHash) {
      err = `userHash ${userHash} already exist in database`;
      return { address: undefined, err: err };
    }
  }

  // Generate key using flow cli through execSync (fcl doen't have the func of key generation)
  const result = execSync("flow keys generate").toString().split(/\n/);
  const privateKey = result[6].replace("Private Key \t\t ", "").trim();
  const publicKey = result[7].replace("Public Key \t\t ", "").trim();
  const mnemonic = result[8].replace("Mnemonic \t\t ", "").trim();

  // Create flow account using public key
  const flowService = new FlowService(
    config.adminAddress,
    config.adminPrivateKeyHex,
    config.adminAccountKeyIndex
  );

  const authorization = flowService.authorize();

  const transaction = `
  import Crypto
  import SampleNFT from ${config.sampleNft}
  import NonFungibleToken from ${config.nonFungibleTokenAddress}
  import MetadataViews from ${config.metadataViewsAddress}
            
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

        account.save(<-SampleNFT.createEmptyCollection(), to: SampleNFT.CollectionStoragePath)

        account.link<&SampleNFT.Collection{NonFungibleToken.CollectionPublic, SampleNFT.SampleNFTCollectionPublic, MetadataViews.ResolverCollection}>(
                SampleNFT.CollectionPublicPath,
                target: SampleNFT.CollectionStoragePath
        )
    
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

  // Get assigned address from tx event
  let assignedAddress = "";
  txResult.events.map((event) => {
    if (event.type == "flow.AccountCreated") {
      assignedAddress = event.data.address;
    }
  });

  // Save account params to mongodb
  //  TODO: Store the private key in a secure place like GCP Secret Manager
  //  For developing, store keys in mongodb
  const userInstance = new User();
  userInstance.userHash = userHash;
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
      return { address: undefined, err: err };
    }
  });

  return { address: assignedAddress, err: err };

  // TODO: コレクションを生成する
  // 署名者は作成したユーザーになるので、assignedAddressとprivateKeyを使って認証する
  // const createdUserFlowService = new FlowService(
  //   assignedAddress,
  //   privateKey,
  //   0
  // );

  // const createdUserAuthorization = createdUserFlowService.authorize();

  // const createCollectionTransaction = `
  // import SampleNFT from ${config.adminAddress}

  // transaction {
  //   prepare(acct: AuthAccount) {
  //     // store an empty NFT Collection in account storage
  //     acct.save<@SampleNFT.Collection>(<-SampleNFT.createEmptyCollection(), to: /storage/nftTutorialCollection)

  //     // publish a capability to the Collection in storage
  //     acct.link<&{SampleNFT.NFTReceiver}>(SampleNFT.CollectionPublicPath, target: SampleNFT.CollectionStoragePath)

  //     log("Created a new empty collection and published a reference")
  //   }
  // }
  // `;

  // console.log(createCollectionTransaction);

  // const txCreateCollectionResult = await createdUserFlowService.sendTx({
  //   createCollectionTransaction,
  //   args: [],
  //   authorizations: [createdUserAuthorization],
  //   payer: createdUserAuthorization,
  //   proposer: createdUserAuthorization,
  // });

  // console.log("txCreateCollectionResult: ", txCreateCollectionResult);
}

module.exports = createAccount;
