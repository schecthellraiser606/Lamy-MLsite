import { memo, useCallback, VFC } from "react";
import { SecondaryButton } from "../../atoms/buttons/SecondaryButton";
import { AvatorSignInUser } from "./avatorSignInUser";
import { userState } from "../../../store/userState";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  Portal,
  Avatar,
  Stack,
} from "@chakra-ui/react";

// eslint-disable-next-line react/display-name
export const AvatorPopover: VFC = memo(() => {
  const router = useRouter();
  const signInUser = useRecoilValue(userState);

  const getImageSrc = useCallback(
    (filepath: string) => {
      if (signInUser.id) {
        return require(`../../../image/myimage/${filepath}.jpg`);
      } else {
        return require(`../../../image/myimage/${filepath}.jpg`);
      }
    },
    [signInUser],
  );

  const onClickLogin = () => {
    router.push("/login");
  };

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label="UserAvator"
          size="lg"
          variant="unstyled"
          icon={signInUser.id ? <Avatar name={signInUser.name} src={getImageSrc("channels4_profile")} /> : <Avatar />}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent backgroundColor="gray.600">
          <PopoverArrow />
          <PopoverHeader>{signInUser.id ? "ユーザ管理" : "ログインを行なってください"}</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            {signInUser.id ? (
              <AvatorSignInUser uid={signInUser.id} />
            ) : (
              <Stack>
                <SecondaryButton disable={false} loading={false} onClick={onClickLogin}>
                  ログインページ
                </SecondaryButton>
              </Stack>
            )}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
});
