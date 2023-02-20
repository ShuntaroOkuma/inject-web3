/*
Usage sample:
  flow scripts execute cadence/scripts/check-nft.cdc 0x01
*/

import SampleNFT from 0x01

pub fun main(address: Address):[UInt64] {
    // Get the accounts' public account objects
    let acct = getAccount(address)

    // Find the public Receiver capability for their Collections
    let acctCapability = acct.getCapability(SampleNFT.CollectionPublicPath)

    // borrow references from the capabilities
    let nftRef = acctCapability.borrow<&{SampleNFT.NFTReceiver}>()
        ?? panic("Could not borrow acct1 nft collection reference")

    return nftRef.getIDs()
}
