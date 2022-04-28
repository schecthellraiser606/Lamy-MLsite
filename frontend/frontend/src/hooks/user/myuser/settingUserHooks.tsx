import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { myWorshipState, myTokenState } from "../../../store/myUserState";
import { userState } from "../../../store/userState";
import { tokenCreateApi, myUserApi } from "../../../types/responseType";
import { useMessage } from "../../useMessage";

export const useSettingHook = () => {
  const { showMessage } = useMessage();
  const [myLoading, setmyLoading] = useState(false);
  const router = useRouter();

  const [myWorship, setMyWorship] = useRecoilState(myWorshipState);
  const [myToken, setMyToken] = useRecoilState(myTokenState);
  const signInUser = useRecoilValue(userState);

  const userCreate = useCallback(
    async (uid: string, name: string, worship: string) => {
      setmyLoading(true);
      const data = { uid: uid, displayname: name, worship: worship };
      axios
        .post<myUserApi>(`http://${process.env.NEXT_PUBLIC_URL}/aiapps/user/`, data, {
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
          setmyLoading(false);
        });
    },
    [setMyWorship],
  );

  const userGet = useCallback(
    async (uid: string) => {
      setmyLoading(true);
      axios
        .get<myUserApi>(`http://${process.env.NEXT_PUBLIC_URL}/aiapps/user/${uid}`)
        .then((res) => {
          const data = res.data;
          setMyWorship({ worship: data.worship });
        })
        .catch((e) => {
          console.log("false get worship");
        })
        .finally(() => {
          setmyLoading(false);
        });
    },
    [setMyWorship],
  );

  const userWorshipUpdate = useCallback(
    async (uid: string | undefined, worship: string) => {
      setmyLoading(true);
      const data = { uid: uid, displayname: signInUser.name, worship: worship };
      axios
        .put<myUserApi>(`http://${process.env.NEXT_PUBLIC_URL}/aiapps/update/`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${myToken.token}`,
          },
        })
        .then((res) => {
          const data = res.data;
          setMyWorship({ worship: data.worship });
          showMessage({ title: "推しを更新しました。", status: "success" });
        })
        .catch((e) => {
          showMessage({ title: "推しの更新に失敗しました。再度ログインして下さい。", status: "error" });
          router.push("/user_setting");
        })
        .finally(() => {
          setmyLoading(false);
        });
    },
    [myToken.token, showMessage, setMyWorship, signInUser.name, router],
  );

  const userMyNameUpdate = useCallback(
    async (uid: string | undefined, name: string) => {
      setmyLoading(true);
      const data = { uid: uid, displayname: name, worship: myWorship.worship };
      axios
        .put<myUserApi>(`http://${process.env.NEXT_PUBLIC_URL}/aiapps/update/`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${myToken.token}`,
          },
        })
        .then((res) => {
          showMessage({ title: "名前の更新をしました。", status: "success" });
        })
        .catch((e) => {
          showMessage({ title: "名前の更新に失敗しました。再度ログインして下さい。", status: "error" });
          router.push("/user_setting");
        })
        .finally(() => {
          setmyLoading(false);
        });
    },
    [showMessage, setmyLoading, myToken.token, myWorship, router],
  );

  const userTokenPost = useCallback(
    async (uid: string) => {
      setmyLoading(true);
      const data = { uid: uid };
      axios
        .post<tokenCreateApi>(`http://${process.env.NEXT_PUBLIC_URL}/aiapps/login/`, data, {
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
          setmyLoading(false);
        });
    },
    [showMessage, setMyToken],
  );

  return { userTokenPost, userCreate, userGet, userWorshipUpdate, userMyNameUpdate, myLoading };
};
