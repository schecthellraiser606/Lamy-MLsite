import axios from "axios";
import { useCallback, useState } from "react";
import { useMessage } from "../../useMessage";

export const useSettingHook = () => {
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState(false);

  const userCreate = useCallback(async (uid: string, name: string, worship: string) => {
    setLoading(true);
    const data = { uid: uid, displayname: name, worship: worship };
    axios
      .post("http://localhost:8000/aiapps/user/", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { userCreate, loading };
};
