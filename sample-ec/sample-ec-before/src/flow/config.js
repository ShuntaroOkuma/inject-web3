import { config } from "@onflow/fcl";

config({
  "accessNode.api": "http://localhost:8888",
  // Testnet: "https://rest-testnet.onflow.org",
  // Mainnet: "https://rest-mainnet.onflow.org",
  "discovery.wallet": "http://localhost:8701/fcl/authn",
  // Testnet: "https://fcl-discovery.onflow.org/testnet/authn",
  // Mainnet: "https://fcl-discovery.onflow.org/authn",
  "flow.network": "local",
  "app.detail.title": "inject-web3",
  "0xSampleNFT": "0x01",
});
