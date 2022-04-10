import { atom } from "recoil";

type Parent = {
  id: number | null;
};

export const parentCommentState = atom<Parent>({
  key: "parentCommentState",
  default: { id: null },
});
