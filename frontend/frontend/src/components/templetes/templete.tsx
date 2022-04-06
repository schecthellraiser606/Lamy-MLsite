import { memo, ReactNode, VFC } from "react";
import { Header } from "../organisms/layout/Header";
import { Footer } from "../organisms/layout/Footer";
import { Box, Flex, Spacer } from "@chakra-ui/react";
import { ScrollTop } from "../atoms/buttons/ScrollTop";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { userState } from "../../store/userState";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../../api/firebase/firebase"; 
import useIsomorphicLayoutEffect from "../../hooks/canUseDom";

type Props = {
  children: ReactNode;
};

// eslint-disable-next-line react/display-name
export const Templete: VFC<Props> = memo((props) => {
  const setUser = useSetRecoilState(userState);
  const resetStatus = useResetRecoilState(userState);

  useIsomorphicLayoutEffect(() => {
    const unsubscribed = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser({
          isSignedIn: true,
          isLoading: false,
          id: user.uid,
          name: user.displayName || undefined,
        });
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
