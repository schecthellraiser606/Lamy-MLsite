import { memo, ReactNode, VFC } from "react";
import { Header } from "../organisms/layout/Header";
import { Footer } from "../organisms/layout/Footer";
import { Box, Flex, Spacer } from "@chakra-ui/react";
import { ScrollTop } from "../atoms/buttons/ScrollTop";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { userState } from "../../store/userState";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../../api/firebase/firebase"; // Initialize FirebaseApp
import useIsomorphicLayoutEffect from "../../hooks/canUseDom";
import { useSettingHook } from "../../hooks/user/myuser/settingUserHooks";
// import { useAccessControll } from "../../hooks/user/accessControlHook";

type Props = {
  children: ReactNode;
};

// eslint-disable-next-line react/display-name
export const Templete: VFC<Props> = memo((props) => {
  const setUser = useSetRecoilState(userState);
  const resetStatus = useResetRecoilState(userState);
  const { userGet } = useSettingHook();

  useIsomorphicLayoutEffect(() => {
    const unsubscribed = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser({
          isSignedIn: true,
          isLoading: false,
          id: user.uid,
          name: user.displayName || undefined,
        });
        userGet(user.uid);
      } else {
        resetStatus();
      }
    });
    return () => unsubscribed();
  }, [setUser, resetStatus]);

  // useAccessControll();

  const { children } = props;
  return (
    <Box backgroundColor="#002">
      <Header />
      {children}
      <Flex justifyContent="center">
        <Spacer />
        <Box marginRight="10px">
          <ScrollTop />
        </Box>
      </Flex>
      <Footer />
    </Box>
  );
});
