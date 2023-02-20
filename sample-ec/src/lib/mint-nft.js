import * as fcl from "@onflow/fcl";

const getAccountAddress = async (userId) => {
  const addr = await fcl.query({
    cadence: `
      import SampleNFT from 0xSampleNFT

      pub fun main(userId: UInt64): Profile.ReadOnly? {
        return Profile.read(address)
      }
    `,
    args: (arg, t) => [arg(userId, t.UInt64)],
  });

  return addr;
};
