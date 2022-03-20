import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Templete } from "../components/templetes/templete";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import theme from "../styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Templete>
          <Component {...pageProps} />
        </Templete>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
