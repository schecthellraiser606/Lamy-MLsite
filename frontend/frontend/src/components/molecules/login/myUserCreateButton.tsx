import { Flex, Spacer, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useRecoilValue } from "recoil";
import { useSettingHook } from "../../../hooks/user/myuser/settingUserHooks";
import { myWorshipState } from "../../../store/myUserState";
import { userState } from "../../../store/userState";
import { PrimaryButton } from "../../atoms/buttons/PrimaryButton";
import { useRouter } from "next/router";
import { useMessage } from "../../../hooks/useMessage";

type Props = {
  value: string;
};

// eslint-disable-next-line react/display-name
export const MyUserCreateButton: VFC<Props> = memo((props) => {
  const { value } = props;
  const router = useRouter();
  const { showMessage } = useMessage();
  const { userTokenPost, userCreate, userGet, myLoading } = useSettingHook();
  const signInUser = useRecoilValue(userState);
  const myWorship = useRecoilValue(myWorshipState);

  const onClick = () => {
    try {
      if (signInUser.id && signInUser.name && !myWorship.worship && signInUser.isSignedIn) {
        userCreate(signInUser.id, signInUser.name, value);
        userGet(signInUser.id);
        router.push("/");
      }
      if (signInUser.id && signInUser.isSignedIn) {
        userTokenPost(signInUser.id);
        router.push("/");
      } else {
        showMessage({ title: "再度ログインして下さい。", status: "error" });
        router.push("/login");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Flex flexDirection="row">
      <Spacer />
      <PrimaryButton disable={!signInUser.isSignedIn} loading={myLoading} onClick={onClick}>
        ログイン
      </PrimaryButton>
    </Flex>
  );
});
