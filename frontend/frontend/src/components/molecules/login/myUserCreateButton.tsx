import { Flex, Spacer } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useRecoilValue } from "recoil";
import { useSettingHook } from "../../../hooks/user/myuser/settingUserHooks";
import { myWorshipState } from "../../../store/myUserState";
import { userState } from "../../../store/userState";
import { PrimaryButton } from "../../atoms/buttons/PrimaryButton";
import { useRouter } from "next/router";

type Props = {
  value: string;
};

// eslint-disable-next-line react/display-name
export const MyUserCreateButton: VFC<Props> = memo((props) => {
  const { value } = props;
  const router = useRouter();
  const { userTokenPost, userCreate, loading } = useSettingHook();
  const signInUser = useRecoilValue(userState);
  const myWorship = useRecoilValue(myWorshipState);

  const onClick = () => {
    try {
      if (signInUser.id && signInUser.name && !myWorship.worship) {
        userCreate(signInUser.id, signInUser.name, value);
      }
      if (signInUser.id) {
        userTokenPost(signInUser.id);
      }
    } finally {
      // router.push("/login")
    }
  };

  return (
    <Flex flexDirection="row">
      <Spacer />
      <PrimaryButton disable={!signInUser.id} loading={loading} onClick={onClick}>
        登録
      </PrimaryButton>
    </Flex>
  );
});
