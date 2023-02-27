/*
Usage sample:
  flow transactions send cadence/transactions/mint-nft.cdc 0x05 testname testnft dummy '{"pruductNo":"abc01"}' --signer emulator-account
*/

import SampleNFT from 0x0000000000000001
import NonFungibleToken from 0x0000000000000001
import MetadataViews from 0x0000000000000001

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

    self.minterRef.mintNFT(recipient:receiverRef, name:name, description:description, thumbnail:thumbnail, metadata:metadata)

    log("New NFT minted")
  }

}