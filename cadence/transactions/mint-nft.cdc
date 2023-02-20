/*
Usage sample:
  flow transactions send cadence/transactions/mint-nft.cdc 0x05 --signer emulator-account
*/

import SampleNFT from 0x01

transaction(address: Address) {

  // Private reference to this account's minter resource
  let minterRef: &SampleNFT.NFTMinter

  prepare(acct: AuthAccount) {
    // Borrow a reference for the NFTMinter in storage
    self.minterRef = acct.borrow<&SampleNFT.NFTMinter>(from: SampleNFT.MinterStoragePath)
        ?? panic("Could not borrow owner's NFT minter reference")
  }

  execute {
    // Get the recipient's public account object
    let recipient = getAccount(address)

    // Get the Collection reference for the receiver
    // getting the public capability and borrowing a reference from it
    let receiverRef = recipient.getCapability(SampleNFT.CollectionPublicPath)
                                .borrow<&{SampleNFT.NFTReceiver}>()
                                ?? panic("Could not borrow nft receiver reference")

    // Mint an NFT and deposit it into account 0x01's collection
    receiverRef.deposit(token: <-self.minterRef.mintNFT())

    log("New NFT minted")
  }

}