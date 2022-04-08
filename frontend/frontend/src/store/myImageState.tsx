import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { LearningImagee } from "../types/responseType";

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: typeof window === "undefined" ? undefined : sessionStorage,
});

export const myImageState = atom<LearningImagee>({
  key: "myImageState",
  default: {
    accurancy: 0,
    class_name: "沙花叉クロヱ",
    created_image_at: "",
    id: 0,
    image: "",
    is_main: false,
    updated_image_at: "",
    user: {
      displayname: "",
      worship: "雪花ラミィ",
      created_user_at: "",
      updated_user_at: "",
    },
  },
  effects_UNSTABLE: [persistAtom],
});
