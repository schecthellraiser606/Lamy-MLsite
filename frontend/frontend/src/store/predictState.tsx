import { atom } from "recoil";

type Predict = { class_name: string };

export const predictState = atom<Predict>({
  key: "predictState",
  default: { class_name: "沙花叉クロヱ" },
});
