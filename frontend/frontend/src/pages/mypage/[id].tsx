import {
  Box,
  Button,
  ChakraProvider,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  InputRightElement,
  Select,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuthHook } from "../../hooks/user/authhook";
import { SecondaryButton } from "../../components/atoms/buttons/SecondaryButton";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import useIsomorphicLayoutEffect from "../../hooks/canUseDom";
import Snowfall from "react-snowfall";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { myTokenState, myWorshipState } from "../../store/myUserState";
import { useSettingHook } from "../../hooks/user/myuser/settingUserHooks";
import themeSelect from "../../styles/themeSelect";
import { myProfileImage } from "../../store/myImageState";
import { useImageFilter } from "../../hooks/image/imageFilter";
import { useImageHook } from "../../hooks/image/imageHook";
import { ProtectRoute } from "../../components/route/PrivateRoute";

// eslint-disable-next-line react/display-name
export default function MyPage() {
  const wlists = [
    "雪花ラミィ",
    "獅白ぼたん",
    "桃鈴ねね",
    "尾丸ポルカ",
    "沙花叉クロヱ",
    "ラプラスダークネス",
    "鷹嶺ルイ",
    "博衣こより",
    "風間いろは",
  ];
  const auth = getAuth();
  const signInUser = auth.currentUser;
  const myWorship = useRecoilValue(myWorshipState);
  const myTokenValue = useRecoilValue(myTokenState);
  const myProfileImages = useRecoilValue(myProfileImage);

  const router = useRouter();
  const query = router.query;

  const { profImage, filterProfile } = useImageFilter();
  const { profileImageGet } = useImageHook();

  const { loading, userUpdateName, userUpdateEmail, userSignOut } = useAuthHook();
  const { myLoading, userWorshipUpdate, userMyNameUpdate } = useSettingHook();

  const [name, setName] = useState(signInUser?.displayName ?? "");
  const [email, setEmail] = useState(signInUser?.email ?? "");
  const [worship, setWorship] = useState(myWorship.worship);
  const resetMyUser = useResetRecoilState(myWorshipState);
  const resetMyToken = useResetRecoilState(myTokenState);

  useIsomorphicLayoutEffect(() => {
    filterProfile(myProfileImages);
    setName(signInUser?.displayName ?? "");
    setEmail(signInUser?.email ?? "");
    setWorship(myWorship.worship);
  }, [signInUser, myWorship]);

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const onChangeWorship = (e: ChangeEvent<HTMLSelectElement>) => setWorship(e.target.value);

  const onClickUpdateName = () => {
    userUpdateName(name);
    userMyNameUpdate(signInUser?.uid, name);
  };
  const onClickUpdateEmail = () => userUpdateEmail(email);
  const onClickUpdateWorship = () => userWorshipUpdate(signInUser?.uid, worship);

  const onClickLogout = () => {
    resetMyUser();
    resetMyToken();
    userSignOut();
  };
  const onClickTop = () => {
    router.push("/");
  };

  return (
    <ProtectRoute>
      <ChakraProvider theme={themeSelect}>
        <Snowfall />
        <Flex align="center" justify="center">
          <Box bg="gray.400" padding={{ base: 3, md: 5 }} w={{ base: "sm", md: "3xl" }} m={{ base: 5, md: 20 }}>
            {query.id === signInUser?.uid ? (
              <>
                <Heading fontSize={{ base: "lg", md: "2xl" }}>ユーザ情報</Heading>
                <Divider my={{ base: 3, md: 7 }} color="black" />

                <Flex align="center" justify="center" flexDirection="column">
                  <Image w={400} src={profImage?.image} alt="Myimage" />
                  <Stack py={{ base: 1, md: 2 }}>
                    <Text>真の姿：{profImage?.class_name}</Text>
                    <Text>AI精度：{profImage?.accurancy}</Text>
                  </Stack>
                </Flex>

                <Divider my={{ base: 2, md: 6 }} color="black" />
                <Stack textAlign="center">
                  <FormControl>
                    <FormLabel>ユーザ名</FormLabel>
                    <Input
                      value={name}
                      onChange={onChangeName}
                      isReadOnly={myTokenValue.token ? false : true}
                      borderColor="black"
                    />
                    <InputRightElement>
                      <Button size="xs" onClick={onClickUpdateName} isLoading={loading || myLoading} color="black">
                        変更
                      </Button>
                    </InputRightElement>
                  </FormControl>

                  <Spacer />

                  <FormControl>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      value={email}
                      onChange={onChangeEmail}
                      isReadOnly={myTokenValue.token ? false : true}
                      borderColor="black"
                    />
                    <InputRightElement>
                      <Button size="xs" onClick={onClickUpdateEmail} isLoading={loading || myLoading} color="black">
                        変更
                      </Button>
                    </InputRightElement>
                  </FormControl>

                  <Spacer />

                  <FormControl>
                    <FormLabel>推し</FormLabel>
                    <Select
                      value={worship}
                      onChange={onChangeWorship}
                      isReadOnly={myTokenValue.token ? false : true}
                      borderColor="black"
                    >
                      {wlists.map((list, index) => (
                        <option value={list} key={index}>
                          {list}
                        </option>
                      ))}
                    </Select>
                    <InputRightElement>
                      <Button size="xs" onClick={onClickUpdateWorship} isLoading={loading || myLoading} color="black">
                        変更
                      </Button>
                    </InputRightElement>
                  </FormControl>
                </Stack>

                <Divider my={{ base: 2, md: 6 }} color="black" />

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
                <Divider my={{ base: 3, md: 7 }} color="black" />
                <Button rightIcon={<ArrowForwardIcon />} colorScheme="cyan" variant="outline" onClick={onClickTop}>
                  トップページへ
                </Button>
              </>
            )}
          </Box>
        </Flex>
      </ChakraProvider>
    </ProtectRoute>
  );
}
