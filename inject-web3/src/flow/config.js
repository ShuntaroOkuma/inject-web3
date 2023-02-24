import fcl from "@onflow/fcl";

module.exports = fcl.config({
  "accessNode.api": "http://localhost:3569",
  // Testnet: "https://rest-testnet.onflow.org",
  // Mainnet: "https://rest-mainnet.onflow.org",
  "discovery.wallet": "http://localhost:8701/fcl/authn",
  // Testnet: "https://fcl-discovery.onflow.org/testnet/authn",
  // Mainnet: "https://fcl-discovery.onflow.org/authn",
  // TODO: アドレスの変換をここに入れる
});
