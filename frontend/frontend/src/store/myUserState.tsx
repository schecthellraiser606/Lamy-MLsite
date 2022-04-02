import { atom } from "recoil";
import { MyWorhip, MyToken } from "../types/userType";

export const myWorshipState = atom<MyWorhip>({
  key: "myWorShip",
  default: { worship: "" },
});

export const myToken = atom<MyToken>({
  key: "myToken",
  default: { token: "" },
});
