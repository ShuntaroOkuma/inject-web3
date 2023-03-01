import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const userIdState = atom({
  key: "userId",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
