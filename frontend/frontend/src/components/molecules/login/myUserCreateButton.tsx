import { Flex, Spacer } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useRecoilValue } from "recoil";
import { useSettingHook } from "../../../hooks/user/myuser/settingUserHooks";
import { userState } from "../../../store/userState";
import { PrimaryButton } from "../../atoms/buttons/PrimaryButton";

type Props = {
  value: string;
};

// eslint-disable-next-line react/display-name
export const MyUserCreateButton: VFC<Props> = memo((props) => {
  const { value } = props;
  const { userCreate, loading } = useSettingHook();
  const signInUser = useRecoilValue(userState);

  const onClick = () => {
    if (signInUser.id && signInUser.name) {
      userCreate(signInUser.id, signInUser.name, value);
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
