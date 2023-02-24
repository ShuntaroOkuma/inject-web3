const fcl = require("@onflow/fcl");
const EC = require("elliptic").ec;
const SHA3 = require("sha3").SHA3;

const ec = new EC("p256");

class FlowService {
  constructor(flowAddress, privateKeyHex, accountIndex) {
    this.flowAddress = flowAddress;
    this.privateKeyHex = privateKeyHex;
    this.accountIndex = accountIndex;
  }

  authorize = () => {
    return async (account = {}) => {
      const user = await this.getAccount(this.flowAddress);
      const key = user.keys[this.accountIndex];

      const sign = this.signWithKey;
      const pk = this.privateKeyHex;

      return {
        ...account,
        tempId: `${user.address}-${key.index}`,
        addr: fcl.sansPrefix(user.address),
        keyId: Number(key.index),
        signingFunction: (signable) => {
          return {
            addr: fcl.withPrefix(user.address),
            keyId: Number(key.index),
            signature: sign(pk, signable.message),
          };
        },
      };
    };
  };

  getAccount = async (addr) => {
    const { account } = await fcl.send([fcl.getAccount(addr)]);
    return account;
  };

  signWithKey = (privateKey, msg) => {
    const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
    const sig = key.sign(this.hashMsg(msg));
    const n = 32;
    const r = sig.r.toArrayLike(Buffer, "be", n);
    const s = sig.s.toArrayLike(Buffer, "be", n);
    return Buffer.concat([r, s]).toString("hex");
  };

  hashMsg = (msg) => {
    const sha = new SHA3(256);
    sha.update(Buffer.from(msg, "hex"));
    return sha.digest();
  };

  sendTx = async ({
    transaction,
    args,
    proposer,
    authorizations,
    payer,
    skipSeal,
  }) => {
    const response = await fcl.mutate({
      cadence: transaction,
      args: (_arg, _t) => args,
      proposer,
      authorizations,
      payer,
      limit: 9999,
    });

    if (skipSeal) return response;
    return await fcl.tx(response).onceSealed();
  };

  async executeScript({ script, args }) {
    return await fcl.query({
      cadence: script,
      args: (_arg, _t) => args,
    });
  }

  async getLatestBlockHeight() {
    const block = await fcl.send([fcl.getBlock(true)]);
    const decoded = await fcl.decode(block);
    return decoded.height;
  }
}

module.exports = FlowService;
