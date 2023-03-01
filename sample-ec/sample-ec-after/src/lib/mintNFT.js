// import { sha256 } from "./hash";

// const mintNFT = async ({ item, metadata }) => {
//   console.log("mint item: ", item);
//   console.log("mint metadata: ", metadata);
//   // console.log("metadata: ", item.metadata);
//   // console.log("mintNFT, userId: ", item.metadata.userId);

//   const userHash = await sha256(metadata.userId);

//   // Call API to mint NFT
//   const result = await fetch("http://localhost:5001/nfts", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       userHash: userHash,
//       name: item.description,
//       description: item.description,
//       thumbnail: "test",
//       metadata: {
//         amount_subtotal: item.amount_subtotal,
//         currency: item.currency,
//         quantity: item.quantity,
//       },
//     }),
//   }).then((response) => response.json());

//   console.log(result);
// };

// export default mintNFT();
