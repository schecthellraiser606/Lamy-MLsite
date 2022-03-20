import Router from "next/router";
import { memo, ReactNode, VFC } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/userState";

type Props = {
  children: ReactNode;
};

// eslint-disable-next-line react/display-name
export const PublicRoute: VFC<Props> = memo((props) => {
  const { children } = props;
  const signInUser = useRecoilValue(userState);

  if (signInUser.id) {
    if (typeof window !== "undefined") {
      Router.replace({
        pathname: "/mypage/[id]",
        query: { id: signInUser.id },
      });
    }
  }
  return <>{children}</>;
});
