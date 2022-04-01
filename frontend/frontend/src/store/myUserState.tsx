import { atom } from "recoil";
import { MyUserType } from "../types/userType";

export const myUserState = atom<MyUserType>({
  key: "myUserState",
  default: { worship: "", token: "" },
});
