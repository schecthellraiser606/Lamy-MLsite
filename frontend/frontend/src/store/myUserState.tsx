import { atom } from "recoil";
import { MyWorhip, MyToken } from "../types/userType";

export const myWorshipState = atom<MyWorhip>({
  key: "myWorShipState",
  default: { worship: "" },
});

export const myTokenState = atom<MyToken>({
  key: "myTokenState",
  default: { token: "" },
});
