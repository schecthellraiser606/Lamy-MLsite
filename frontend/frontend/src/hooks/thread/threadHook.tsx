import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useRecoilValue } from "recoil";
import { myTokenState } from "../../store/myUserState";
import { Thread } from "../../types/responseType";
import { useMessage } from "../useMessage";

export const useThreadHook = () => {
  const { showMessage } = useMessage();
  const [threadLoading, setThreadLoading] = useState(false);
  const myToken = useRecoilValue(myTokenState);
  const router = useRouter();

  const threadPost = useCallback(
    (uid: string, title: string, text: string) => {
      setThreadLoading(true);
      const url = `http://${process.env.NEXT_PUBLIC_URL}:8000/aiapps/thread/`;
      const data = {
        uid: uid,
        title: title,
        text: text,
      };
      axios
        .post<Thread>(url, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${myToken.token}`,
          },
        })
        .then((res) => {
          showMessage({ title: "掲示板を作成しました。", status: "success" });
          router.push("/thread/thread_index");
        })
        .catch((err) => {
          showMessage({ title: "設定に失敗しました。再度ログインして下さい。", status: "error" });
          router.push("/user_setting");
        })
        .finally(() => {
          setThreadLoading(false);
        });
    },
    [showMessage, myToken.token, router],
  );

  return { threadLoading, threadPost };
};
