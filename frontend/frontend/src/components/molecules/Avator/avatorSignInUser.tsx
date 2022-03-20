import { Stack } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useAuthHook } from "../../../hooks/user/authhook";
import { SecondaryButton } from "../../atoms/buttons/SecondaryButton";
import { useRouter } from "next/router";

type Props = {
  uid: string;
};

// eslint-disable-next-line react/display-name
export const AvatorSignInUser: VFC<Props> = memo((props) => {
  const { uid } = props;
  const router = useRouter();
  const { userSignOut } = useAuthHook();

  const onClickLogout = () => userSignOut();
  const onClickUserSetting = () => {
    router.push({
      pathname: "/mypage/[id]",
      query: { id: uid },
    });
  };

  return (
    <Stack>
      <SecondaryButton disable={false} loading={false} onClick={onClickUserSetting}>
        ユーザページ
      </SecondaryButton>
      <SecondaryButton disable={false} loading={false} onClick={onClickLogout}>
        ログアウト
      </SecondaryButton>
    </Stack>
  );
});
