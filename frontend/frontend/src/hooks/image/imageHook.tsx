import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { myImageState } from "../../store/myImageState";
import { myTokenState } from "../../store/myUserState";
import { LearningImagee } from "../../types/responseType";
import { useMessage } from "../useMessage";

export const useImageHook = () => {
  const { showMessage } = useMessage();
  const [imageLoading, setImageLoading] = useState(false);
  const router = useRouter();
  const [myImageValue, setLearningImage] = useRecoilState(myImageState);
  const myToken = useRecoilValue(myTokenState);

  const profileImageSet = useCallback(() => {
    setImageLoading(true);
    const url = `http://localhost:8000/aiapps/image/${myImageValue.id}/`;
    const data = {
      is_main: true,
    };
    axios
      .patch<LearningImagee>(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${myToken.token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        setLearningImage({
          accurancy: data.accurancy,
          class_name: data.class_name,
          created_at: data.created_at,
          id: data.id,
          image: data.image,
          is_main: data.is_main,
          updated_at: data.updated_at,
          user: {
            displayname: data.user.displayname,
            worship: data.user.worship,
            created_user_at: data.user.created_user_at,
            updated_user_at: data.user.updated_user_at,
          },
        });
        showMessage({ title: "プロフィール画像に設定しました。", status: "success" });
      })
      .catch((err) => {
        showMessage({ title: "設定に失敗しました。再度ログインして下さい。", status: "error" });
        router.push("/user_setting");
      })
      .finally(() => setImageLoading(false));
  }, [myToken, showMessage, myImageValue, router, setLearningImage]);

  return { profileImageSet, imageLoading };
};
