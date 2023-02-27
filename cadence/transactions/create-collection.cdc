/*
Usage sample:
  flow transactions send cadence/transactions/create-collection.cdc --signer Alice
*/

import SampleNFT from 0x0000000000000001
import NonFungibleToken from 0x0000000000000001
import MetadataViews from 0x0000000000000001

transaction {
  prepare(account: AuthAccount) {
    account.save<@SampleNFT.Collection>(<-SampleNFT.createEmptyCollection(), to: /storage/SampleNFTCollection)

    account.link<&SampleNFT.Collection{NonFungibleToken.CollectionPublic, SampleNFT.SampleNFTCollectionPublic, MetadataViews.ResolverCollection}>(
            SampleNFT.CollectionPublicPath,
            target: SampleNFT.CollectionStoragePath
        )

    log("Created a new empty collection and published a reference")
  }
}