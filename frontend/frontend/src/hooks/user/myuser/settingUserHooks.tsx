import axios from "axios";
import { useCallback, useState } from "react";
import { useSetRecoilState } from "recoil";
import { myWorshipState, myToken } from "../../../store/myUserState";
import { tokenCreateApi, userCreateApi } from "../../../types/responseType";
import { useMessage } from "../../useMessage";

export const useSettingHook = () => {
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState(false);

  const setMyWorship = useSetRecoilState(myWorshipState);
  const setMyToken = useSetRecoilState(myToken);

  const userCreate = useCallback(
    async (uid: string, name: string, worship: string) => {
      setLoading(true);
      const data = { uid: uid, displayname: name, worship: worship };
      axios
        .post<userCreateApi>("http://localhost:8000/aiapps/user/", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const data = res.data;
          setMyWorship({ worship: data.worship });
        })
        .catch((e) => {
          console.log("already create user");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setMyWorship],
  );

  const userTokenPost = useCallback(
    async (uid: string) => {
      setLoading(true);
      const data = { uid: uid };
      axios
        .post<tokenCreateApi>("http://localhost:8000/aiapps/login/", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const data = res.data;
          setMyToken({ token: data.token });
          showMessage({ title: "ログインしました。", status: "success" });
        })
        .catch((e) => {
          showMessage({ title: "ログインに失敗しました", status: "error" });
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [showMessage, setMyToken],
  );

  return { userTokenPost, userCreate, loading };
};
