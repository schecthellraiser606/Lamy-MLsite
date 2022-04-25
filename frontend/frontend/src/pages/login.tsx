import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { LoginForm } from "../components/molecules/login/loginForm";
import Snowfall from "react-snowfall";

// eslint-disable-next-line react/display-name
export default function Login() {
  return (
    <>
      <Snowfall />
      <Flex align="center" justify="center" height="100vh">
        <Stack>
          <Heading padding="2%" fontFamily="Yuji Syuku" margin="auto">
            ログイン
          </Heading>
          <Box borderWidth="1px" borderRadius="10%">
            <LoginForm />
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
