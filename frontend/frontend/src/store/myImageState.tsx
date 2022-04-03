import { atom } from "recoil";
import { LearningImagee } from "../types/responseType";

export const myImageState = atom<LearningImagee>({
  key: "myImageState",
  default: {
    accurancy: 0,
    class_name: "沙花叉クロヱ",
    created_at: "",
    id: 0,
    image: "",
    is_main: false,
    updated_at: "",
  },
});
