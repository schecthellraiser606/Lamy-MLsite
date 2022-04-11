import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Spacer,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, memo, useState, VFC } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { useCommentHook } from "../../../hooks/thread/commentHook";
import { useMessage } from "../../../hooks/useMessage";
import { parentCommentState } from "../../../store/parentCommentState";
import { threadState } from "../../../store/threadState";
import { userState } from "../../../store/userState";
import { SecondaryButton } from "../../atoms/buttons/SecondaryButton";

// eslint-disable-next-line react/display-name
export const CommentForm: VFC = memo(() => {
  const router = useRouter();
  const [text, setText] = useState("");
  const signInUser = useRecoilValue(userState);
  const thread = useRecoilValue(threadState);
  const parent = useRecoilValue(parentCommentState);
  const reflesh = useResetRecoilState(parentCommentState);

  const { commentLoading, commentPost } = useCommentHook();
  const { showMessage } = useMessage();

  const onChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value);
  const isText = !text;

  const onClickPost = () => {
    if (signInUser.id) {
      commentPost(signInUser.id, thread.id, parent.id, parent.index, text);
    } else {
      showMessage({ title: "ログインして下さい。", status: "error" });
      router.push("/login");
    }
  };

  const onClickReflesh = () => reflesh();

  return (
    <>
      {signInUser.isSignedIn ? (
        <Box bgColor="cyan.700" m={4} p={2} w="90%" borderRadius="7px">
          <Heading p={2} fontFamily="Yuji Syuku">
            コメント投稿
          </Heading>
          <Divider />
          <Stack>
            <Flex flexDirection="row" align="center">
              <Text color="yellow.100">返信先:　{parent.index ? parent.index : "なし"}　投稿目</Text>
              <Spacer />
              <Button color="blue.400" onClick={onClickReflesh} _hover={{ opacity: 0.8 }} size="xs" marginTop={2}>
                返信をやめる
              </Button>
            </Flex>
            <FormControl isInvalid={isText}>
              <FormLabel>内容:</FormLabel>
              <Textarea value={text} onChange={onChangeText} borderColor="white" bgColor="gray.600" />
            </FormControl>
          </Stack>
          <Divider />
          <Flex flexDirection="row" align="center" marginTop={3}>
            <Spacer />
            <SecondaryButton onClick={onClickPost} disable={isText} loading={commentLoading}>
              投稿する
            </SecondaryButton>
          </Flex>
        </Box>
      ) : (
        <Text fontFamily="Yuji Syuku">掲示版を作成するためにはログインが必要じゃ。</Text>
      )}
    </>
  );
});
