import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { Thread } from "../types/responseType";

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: typeof window === "undefined" ? undefined : sessionStorage,
});

export const threadState = atom<Thread>({
  key: "threadState",
  default: {
    id: 0,
    user: {
      uid: "",
      displayname: "",
      worship: "",
      created_user_at: "",
      updated_user_at: "",
    },
    title: "",
    text: "",
    created_thread_at: "",
    updated_thread_at: "",
  },
  // effects_UNSTABLE: [persistAtom],
});
