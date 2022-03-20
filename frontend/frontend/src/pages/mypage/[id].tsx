import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputRightElement,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useLayoutEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuthHook } from "../../hooks/user/authhook";
import { SecondaryButton } from "../../components/atoms/buttons/SecondaryButton";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { useRouter } from "next/router";
import { ProtectRoute } from "../../components/route/PrivateRoute";
import useIsomorphicLayoutEffect from "../../hooks/canUseDom";
import Snowfall from "react-snowfall";

export function getImageSrc(filepath: string): string | undefined {
  if (process.env.NODE_ENV === "production") {
    return require(`../image/radio/${filepath}.png`);
  } else {
    return require(`../../image/myimage/channels4_profile.jpg`);
  }
}

const worshipApi = "沙花叉クロヱ";
const accracy = 0.125;
const className = "沙花叉クロヱ";

// eslint-disable-next-line react/display-name
export default function MyPage() {
  const auth = getAuth();
  const signInUser = auth.currentUser;
  const router = useRouter();
  const query = router.query;

  const { loading, userUpdateName, userUpdateEmail, userSignOut } = useAuthHook();

  const [name, setName] = useState(signInUser?.displayName ?? "");
  const [email, setEmail] = useState(signInUser?.email ?? "");
  const [worship, setWorship] = useState(worshipApi);

  useIsomorphicLayoutEffect(() => {
    setName(signInUser?.displayName ?? "");
    setEmail(signInUser?.email ?? "");
    setWorship(worshipApi);
  }, [signInUser]);

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const onChangeWorship = (e: ChangeEvent<HTMLInputElement>) => setWorship(e.target.value);

  const onClickUpdateName = () => userUpdateName(name);
  const onClickUpdateEmail = () => userUpdateEmail(email);
  const onClickUpdateWorship = () => {};
  const onClickLogout = () => userSignOut();
  const onClickTop = () => {
    router.push("/");
  };

  return (
    <ProtectRoute>
      <Snowfall />
      <Flex align="center" justify="center">
        <Box bg="gray.700" padding={{ base: 3, md: 5 }} w={{ base: "sm", md: "3xl" }} m={{ base: 5, md: 20 }}>
          {query.id === signInUser?.uid ? (
            <>
              <Heading fontSize={{ base: "lg", md: "2xl" }}>ユーザ情報</Heading>
              <Divider my={{ base: 3, md: 7 }} />

              <Flex align="center" justify="center" flexDirection="column">
                <Image
                  width={400}
                  height={400}
                  src={getImageSrc("../image/myimage/channels4_profile.png")}
                  alt="Myimage"
                />
                <Stack py={{ base: 1, md: 2 }}>
                  <Text>真の姿：{className}</Text>
                  <Text>AI精度：{accracy}</Text>
                </Stack>
              </Flex>

              <Divider my={{ base: 2, md: 6 }} />
              <Stack textAlign="center">
                <FormControl>
                  <FormLabel>ユーザ名</FormLabel>
                  <Input value={name} onChange={onChangeName} isReadOnly={false} />
                  <InputRightElement>
                    <Button size="xs" onClick={onClickUpdateName} isLoading={loading} color="black">
                      変更
                    </Button>
                  </InputRightElement>
                </FormControl>

                <Spacer />

                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  <Input value={email} onChange={onChangeEmail} isReadOnly={false} />
                  <InputRightElement>
                    <Button size="xs" onClick={onClickUpdateEmail} isLoading={loading} color="black">
                      変更
                    </Button>
                  </InputRightElement>
                </FormControl>

                <Spacer />

                <FormControl>
                  <FormLabel>推し</FormLabel>
                  <Input value={worship} onChange={onChangeWorship} isReadOnly={false} />
                  <InputRightElement>
                    <Button size="xs" onClick={onClickUpdateWorship} isLoading={loading} color="black">
                      変更
                    </Button>
                  </InputRightElement>
                </FormControl>
              </Stack>

              <Divider my={{ base: 2, md: 6 }} />

              <Box textAlign="right">
                <SecondaryButton disable={false} loading={loading} onClick={onClickLogout}>
                  ログアウト
                </SecondaryButton>
              </Box>
            </>
          ) : (
            <>
              <Heading fontSize={{ base: "xl", md: "3xl" }}>
                ユーザ情報にてエラーがあります。
                <br />
                トップページへお戻りください。
              </Heading>
              <Divider my={{ base: 3, md: 7 }} />
              <Button rightIcon={<ArrowForwardIcon />} colorScheme="cyan" variant="outline" onClick={onClickTop}>
                トップページへ
              </Button>
            </>
          )}
        </Box>
      </Flex>
    </ProtectRoute>
  );
}
