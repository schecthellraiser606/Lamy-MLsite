import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { getAuth, signOut, updateEmail, updateProfile } from "firebase/auth";
import "../../api/firebase/firebase"; // Initialize FirebaseApp
import { useMessage } from "../useMessage";

export const useAuthHook = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();

  //サインアウト
  const userSignOut = useCallback(async () => {
    setLoading(true);
    try {
      await signOut(getAuth());
      showMessage({ title: "サインアウトしました", status: "success" });
    } catch (error) {
      showMessage({ title: "サインアウトに失敗しました", status: "error" });
    } finally {
      setLoading(false);
      router.push("/");
    }
  }, [showMessage, router]);

  //UserName更新
  const userUpdateName = useCallback(
    async (name: string) => {
      setLoading(true);
      const authuser = getAuth();
      if (authuser.currentUser && name) {
        updateProfile(authuser.currentUser, {
          displayName: name,
        })
          .then(() => showMessage({ title: "変更完了", status: "info" }))
          .catch((error) => showMessage({ title: "変更できませんでした", status: "error" }))
          .finally(() => {
            setLoading(false);
          });
      } else {
        showMessage({ title: "変更できませんでした。", status: "error" });
        router.push("/");
      }
    },
    [router, showMessage],
  );

  //UserEmailAddress更新
  const userUpdateEmail = useCallback(
    async (email: string) => {
      setLoading(true);
      const authuser = getAuth();
      if (authuser.currentUser && email) {
        updateEmail(authuser.currentUser, email)
          .then(() => showMessage({ title: "変更完了", status: "info" }))
          .catch((error) => showMessage({ title: "変更できませんでした", status: "error" }))
          .finally(() => {
            setLoading(false);
          });
      } else {
        showMessage({ title: "変更できませんでした。", status: "error" });
        router.push("/");
      }
    },
    [router, showMessage],
  );

  return { userSignOut, userUpdateName, userUpdateEmail, loading };
};
