import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { MyWorhip, MyToken } from "../types/userType";

const { persistAtom } = recoilPersist({
	key: "recoil-persist",
	storage: typeof window === "undefined" ? undefined : sessionStorage
});

export const myWorshipState = atom<MyWorhip>({
  key: "myWorShipState",
  default: { worship: "" },
  effects_UNSTABLE: [persistAtom],
});

export const myTokenState = atom<MyToken>({
  key: "myTokenState",
  default: { token: "" },
});
