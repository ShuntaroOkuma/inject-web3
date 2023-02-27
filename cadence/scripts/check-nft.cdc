/*
Usage sample:
  flow scripts execute cadence/scripts/check-nft.cdc 0x01
*/

import SampleNFT from 0x0000000000000001
import NonFungibleToken from 0x0000000000000001
import MetadataViews from 0x0000000000000001

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
