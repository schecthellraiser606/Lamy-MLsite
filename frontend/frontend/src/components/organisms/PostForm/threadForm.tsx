import { Box, Divider, Flex, FormControl, FormLabel, Heading, Input, Spacer, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, memo, useState, VFC } from "react";
import { useRecoilValue } from "recoil";
import { useThreadHook } from "../../../hooks/thread/threadHook";
import { useMessage } from "../../../hooks/useMessage";
import { userState } from "../../../store/userState";
import { SecondaryButton } from "../../atoms/buttons/SecondaryButton";

// eslint-disable-next-line react/display-name
export const ThreadForm: VFC = memo(() => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const signInUser = useRecoilValue(userState);

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onChangeText = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  const { threadLoading, threadPost } = useThreadHook();
  const { showMessage } = useMessage();

  const onClick = () => {
    if (signInUser.id) {
      threadPost(signInUser.id, title, text);
    } else {
      showMessage({ title: "ログインして下さい。", status: "error" });
      router.push("/login");
    }
  };

  return (
    <>
      {signInUser.isSignedIn ? (
        <Box bgColor="cyan.800" m={4} p={2} w="80%" borderRadius="7px">
          <Heading p={2} fontFamily="Yuji Syuku">新規作成</Heading>
          <Stack textAlign="center">
            <FormControl>
              <FormLabel>タイトル</FormLabel>
              <Input value={title} onChange={onChangeTitle} borderColor="white" bgColor="gray.600" />
            </FormControl>
            <FormControl>
              <FormLabel>内容</FormLabel>
              <Input value={text} onChange={onChangeText} borderColor="white" bgColor="gray.600" />
            </FormControl>
          </Stack>
          <Divider p={1} />
          <Flex flexDirection="row" align="center" marginTop={3}>
            <Spacer />
            <SecondaryButton onClick={onClick} loading={threadLoading}>
              掲示板作成
            </SecondaryButton>
          </Flex>
        </Box>
      ) : (
        <Text fontFamily="Yuji Syuku">掲示版を作成するためにはログインが必要じゃ。</Text>
      )}
    </>
  );
});
