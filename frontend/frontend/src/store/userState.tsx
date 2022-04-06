import { atom } from "recoil";
import { AuthState } from "../types/userType";


export const userState = atom<AuthState>({
  key: "userState",
  default: { isSignedIn: false, isLoading: true, id: undefined, name: undefined },
});
