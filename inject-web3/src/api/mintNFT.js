const FlowService = require("../flow/flow");
const getConfig = require("../../config");
const fcl = require("@onflow/fcl");
const t = require("@onflow/types");

const config = getConfig();

function toCadenceDict(metadata) {
  let newData = { ...metadata };

  // Return an array of [{key: string, value: string}].
  return Object.keys(newData).map((k) => ({ key: k, value: metadata[k] }));
}

async function mintNFT(address, name, description, thumbnail, metadata) {
  // TODO: check metadata type (Use TypeScript)

  // Set admin account for auth
  const flowService = new FlowService(
    config.adminAddress,
    config.adminPrivateKeyHex,
    config.adminAccountKeyIndex
  );

  const authorization = flowService.authorize();

  const transaction = `
  import SampleNFT from ${config.sampleNft}
  import NonFungibleToken from ${config.nonFungibleTokenAddress}
  import MetadataViews from ${config.metadataViewsAddress}

  transaction(
    address: Address,
    name: String,
    description: String,
    thumbnail: String,
    metadata: {String:AnyStruct}
    ) {
    let minterRef: &SampleNFT.NFTMinter

    prepare(acct: AuthAccount) {
      self.minterRef = acct.borrow<&SampleNFT.NFTMinter>(from: SampleNFT.MinterStoragePath)
          ?? panic("Could not borrow owner's NFT minter reference")
    }

    execute {
      let recipient = getAccount(address)
      let receiver = recipient.getCapability(SampleNFT.CollectionPublicPath)
      let receiverRef = receiver
          .borrow<&SampleNFT.Collection{NonFungibleToken.CollectionPublic, SampleNFT.SampleNFTCollectionPublic, MetadataViews.ResolverCollection}>()
          ?? panic("Could not borrow nft receiver reference")

      self.minterRef.mintNFT(recipient:receiverRef, name:name, description:description, thumbnail:thumbnail, metadata:{"hoge":"hoge"})

      log("New NFT minted")
    }

  }
  `;

  console.log("mint params: ", address, name, description, thumbnail, metadata);

  const txResult = await flowService.sendTx({
    transaction,
    args: [
      fcl.arg(address, t.Address),
      fcl.arg(name, t.String),
      fcl.arg(description, t.String),
      fcl.arg(thumbnail, t.String),
      fcl.arg(
        toCadenceDict(metadata),
        t.Dictionary({ key: t.String, value: t.String })
      ),
    ],
    authorizations: [authorization],
    payer: authorization,
    proposer: authorization,
  });

  console.log("txResult: ", txResult);
  return txResult;
}

module.exports = mintNFT;
