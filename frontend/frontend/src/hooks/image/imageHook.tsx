import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useRecoilValue } from "recoil";
import { myImageState } from "../../store/myImageState";
import { myTokenState } from "../../store/myUserState";
import { LearningImagee } from "../../types/responseType";
import { useMessage } from "../useMessage";

export const useImageHook =() =>{
  const { showMessage } = useMessage();
  const [imageLoading, setImageLoading] = useState(false);
  const router = useRouter();
  const myImageValue = useRecoilValue(myImageState);
  const myToken = useRecoilValue(myTokenState);
  
  const profileImageSet = useCallback(()=>{
    setImageLoading(true);
    const url = `http://localhost:8000/aiapps/image/${myImageValue.id}/`;
    const data = {
      is_main: true,
      class_name: myImageValue.class_name,
      accurancy: myImageValue.accurancy,
    };
    axios
      .patch<LearningImagee>(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${myToken.token}`,
        },
      })
      .then((res) => {
        showMessage({ title: "プロフィール画像に設定しました。", status: "success" });
      })
      .catch((err) => {
        showMessage({ title: "設定に失敗しました。再度ログインして下さい。", status: "error" });
        router.push("/user_setting");
      })
      .finally(() => setImageLoading(false));
  }, [myToken, showMessage, myImageValue, router])

  return{profileImageSet, imageLoading }
}