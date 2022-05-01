import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useRecoilValue } from "recoil";
import { myTokenState } from "../../store/myUserState";
import { threadState } from "../../store/threadState";
import { useMessage } from "../useMessage";

export const useCommentHook = () => {
  const { showMessage } = useMessage();
  const [commentLoading, setCommentLoading] = useState(false);
  const myToken = useRecoilValue(myTokenState);
  const thread = useRecoilValue(threadState);
  const router = useRouter();

  const commentPost = useCallback(
    (uid: string, thread_id: number, parent_id: number | null, parent_index: number | null, text: string) => {
      setCommentLoading(true);
      const url = `https://${process.env.NEXT_PUBLIC_URL}/aiapps/comment/`;
      const data = {
        uid: uid,
        thread_id: thread_id,
        parent_id: parent_id,
        parent_index: parent_index,
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
          router.push({
            pathname: "/thread/[id]",
            query: { id: thread.id },
          });
        })
        .catch((err) => {
          showMessage({ title: "コメントを投稿できません。再度ログインして下さい。", status: "error" });
          router.push("/user_setting");
        })
        .finally(() => {
          setCommentLoading(false);
        });
    },
    [myToken.token, showMessage, router, thread.id],
  );

  const commentDelete = useCallback(
    (comment_id: number) => {
      setCommentLoading(true);
      const url = `https://${process.env.NEXT_PUBLIC_URL}/aiapps/comment/${comment_id}/`;
      const data = {
        parent_id: null,
        parent_index: null,
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
          router.push({
            pathname: "/thread/[id]",
            query: { id: thread.id },
          });
        })
        .catch((err) => {
          showMessage({ title: "コメントを削除できません。再度ログインして下さい。", status: "error" });
          router.push("/user_setting");
        })
        .finally(() => {
          setCommentLoading(false);
        });
    },
    [myToken.token, router, showMessage, thread.id],
  );

  return { commentLoading, commentPost, commentDelete };
};
