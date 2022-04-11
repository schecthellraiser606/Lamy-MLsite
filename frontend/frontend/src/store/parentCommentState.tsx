import { atom } from "recoil";

type Parent = {
  id: number | null;
  index: number | null;
};

export const parentCommentState = atom<Parent>({
  key: "parentCommentState",
  default: { id: null, index: null },
});
