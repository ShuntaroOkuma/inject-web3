const FlowService = require("../flow/flow");
const getConfig = require("../../config");
const fcl = require("@onflow/fcl");
const t = require("@onflow/types");

const config = getConfig();

async function getNFT(address) {
  const flowService = new FlowService(
    config.adminAddress,
    config.adminPrivateKeyHex,
    config.adminAccountKeyIndex
  );

  const script = `
  import SampleNFT from ${config.sampleNft}
  import NonFungibleToken from ${config.nonFungibleTokenAddress}
  import MetadataViews from ${config.metadataViewsAddress}

  pub fun main(address: Address):[AnyStruct] {
      // Get the accounts' public account objects
      let acct = getAccount(address)

      // Find the public Receiver capability for their Collections
      let acctCapability = acct.getCapability(SampleNFT.CollectionPublicPath)

      // borrow references from the capabilities
      let collectionRef = acctCapability.borrow<&SampleNFT.Collection{NonFungibleToken.CollectionPublic, SampleNFT.SampleNFTCollectionPublic, MetadataViews.ResolverCollection}>()
          ?? panic("Could not borrow acct1 nft collection reference")

      let ids = collectionRef.getIDs()

      let nfts:[AnyStruct] = []

      for id in ids {
        let nftRef = collectionRef.borrowSampleNFT(id: id)
        let nft: {String: AnyStruct} = {
          "id": nftRef?.id,
          "name": nftRef?.name,
          "description": nftRef?.description,
          "thumbnail": nftRef?.thumbnail, 
          "metadata": nftRef?.metadata
        }
        nfts.append(nft)
      }

      return nfts
  }

  `;

  const nfts = await flowService.executeScript({
    script,
    args: [fcl.arg(address, t.Address)],
  });

  return nfts;
}

module.exports = getNFT;
