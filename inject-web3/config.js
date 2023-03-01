const dotenv = require("dotenv");

const flowAccountErrorMessaage = `

No Flow account configured.
Did you export ADMIN_ADDRESS and FLOW_PRIVATE_KEY?

`;

function getConfig() {
  const env = dotenv.config({
    path: ".env",
  }).parsed;

  const port = env.PORT || 5001;

  const accessApi = env.FLOW_ACCESS_API_URL;
  console.log("ACCESS API: ", accessApi);

  const adminAddress = env.ADMIN_ADDRESS;
  const adminPrivateKeyHex = env.ADMIN_PRIVATE_KEY;

  if (!env.ADMIN_ADDRESS || !env.ADMIN_PRIVATE_KEY) {
    throw flowAccountErrorMessaage;
  }

  const adminAccountKeyIndex = env.ADMIN_ACCOUNT_KEY_INDEX || 0;

  const fungibleTokenAddress = env.FUNGIBLE_TOKEN_ADDRESS;

  const nonFungibleTokenAddress = env.NON_FUNGIBLE_TOKEN_ADDRESS;

  const sampleNft = env.SAMPLE_NFT;

  const metadataViewsAddress = env.METADATA_VIEWS_ADDRESS;

  const storefrontAddress = env.NFT_STOREFRONT_ADDRESS;

  const flowTokenAddress = env.FLOW_TOKEN_ADDRESS;

  const mongodbUrl = env.MONGODB_ACCESS_URL;

  return {
    port,
    accessApi,
    adminAddress,
    adminPrivateKeyHex,
    adminAccountKeyIndex,
    fungibleTokenAddress,
    nonFungibleTokenAddress,
    sampleNft,
    metadataViewsAddress,
    storefrontAddress,
    flowTokenAddress,
    mongodbUrl,
  };
}

module.exports = getConfig;
