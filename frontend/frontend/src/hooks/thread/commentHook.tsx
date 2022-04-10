import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useRecoilValue } from "recoil";
import { myTokenState } from "../../store/myUserState";
import { useMessage } from "../useMessage";

export const useCommentHook = () => {
  const { showMessage } = useMessage();
  const [commentLoading, setCommentLoading] = useState(false);
  const myToken = useRecoilValue(myTokenState);
  const router = useRouter();

  const commentPost = useCallback(
    (uid: string, thread_id: number, parent_id: number | null, text: string) => {
      setCommentLoading(true);
      const url = "http://localhost:8000/aiapps/comment/";
      const data = {
        uid: uid,
        thread_id: thread_id,
        parent_id: parent_id,
        text: text,
      };
      axios
        .post(url, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${myToken.token}`,
          },
        })
        .then((res) => {
          showMessage({ title: "コメントを投稿しました。", status: "success" });
        })
        .catch((err) => {
          showMessage({ title: "コメントを投稿できません。再度ログインして下さい。", status: "error" });
          router.push("/user_setting");
        })
        .finally(() => {
          setCommentLoading(false);
        });
    },
    [myToken.token, showMessage, router],
  );

  const commentDelete = useCallback(
    (comment_id: number) => {
      setCommentLoading(true);
      const url = `http://localhost:8000/aiapps/comment/${comment_id}`;
      const data = {
        text: "This Data was Deleted",
      };
      axios
        .patch(url, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${myToken.token}`,
          },
        })
        .then((res) => {
          showMessage({ title: "コメントを削除しました。", status: "success" });
        })
        .catch((err) => {
          showMessage({ title: "コメントを削除できません。再度ログインして下さい。", status: "error" });
          router.push("/user_setting");
        })
        .finally(() => {
          setCommentLoading(false);
        });
    },
    [myToken.token, router, showMessage],
  );

  return { commentLoading, commentPost, commentDelete };
};
