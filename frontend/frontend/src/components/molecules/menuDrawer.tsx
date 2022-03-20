import { Button, Divider, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Stack, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import { userState } from "../../store/userState";
import { SecondaryButton } from "../atoms/buttons/SecondaryButton";
import { AvatorSignInUser } from "./Avator/avatorSignInUser";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  onClickHome: () => void;
};

// eslint-disable-next-line react/display-name
export const MenuDrawer: VFC<Props> = memo((props) => {
  const router = useRouter();
  const { onClose, isOpen, onClickHome } = props;

  const signInUser = useRecoilValue(userState);

  const onClickLogin = () => {
    router.push("/login");
  };
  return (
    <Drawer placement="right" size="xs" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerBody p={0} bg="gray.600">
            <Stack spacing={3} px={5} py={2}>
              <Button w="100%" backgroundColor="cyan.400" color="white" onClick={onClickHome}>
                トップへ
              </Button>
              <Divider my={4} />

              <Text fontSize="lg">ユーザ管理</Text>
              {signInUser.id ? (
                <AvatorSignInUser uid={signInUser.id} />
              ) : (
                <Stack>
                  <SecondaryButton disable={false} loading={false} onClick={onClickLogin}>
                    ログイン
                  </SecondaryButton>
                </Stack>
              )}
              <Divider my={4} />
              <Text fontSize="lg">掲示板</Text>
              <Stack>
                <SecondaryButton disable={false} loading={false} onClick={onClickLogin}>
                  掲示板へ
                </SecondaryButton>
              </Stack>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
});
