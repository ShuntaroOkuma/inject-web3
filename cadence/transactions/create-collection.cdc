/*
Usage sample:
  flow transactions send cadence/transactions/create-collection.cdc --signer Alice
*/

import SampleNFT from 0x01

transaction {
  prepare(acct: AuthAccount) {
    // store an empty NFT Collection in account storage
    acct.save<@SampleNFT.Collection>(<-SampleNFT.createEmptyCollection(), to: /storage/nftTutorialCollection)

    // publish a capability to the Collection in storage
    acct.link<&{SampleNFT.NFTReceiver}>(SampleNFT.CollectionPublicPath, target: SampleNFT.CollectionStoragePath)

    log("Created a new empty collection and published a reference")
  }
}