import { memo, VFC } from "react";
import {
  getAuth,
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import { auth } from "firebaseui";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "../../../api/firebase/firebase";

const uiConfig: auth.Config = {
  signInFlow: "popup",
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    FacebookAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
    TwitterAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: "/user_setting",
};

// eslint-disable-next-line react/display-name
export const LoginForm: VFC = memo(() => {
  return <StyledFirebaseAuth firebaseAuth={getAuth()} uiConfig={uiConfig} />;
});
