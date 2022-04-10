import { Box, Divider, Flex, FormControl, FormLabel, Heading, Spacer, Text, Textarea } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, memo, useState, VFC } from "react";
import { useRecoilValue } from "recoil";
import { useCommentHook } from "../../../hooks/thread/commentHook";
import { useMessage } from "../../../hooks/useMessage";
import { threadState } from "../../../store/threadState";
import { userState } from "../../../store/userState";
import { SecondaryButton } from "../../atoms/buttons/SecondaryButton";

type Props = {
  parent_id: number;
};

// eslint-disable-next-line react/display-name
export const CommentForm: VFC<Props> = memo((prop) => {
  const { parent_id } = prop;
  const router = useRouter();
  const [text, setText] = useState("");
  const signInUser = useRecoilValue(userState);
  const thread = useRecoilValue(threadState);

  const { commentLoading, commentPost } = useCommentHook();
  const { showMessage } = useMessage();

  const onChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value);

  const isText = !text;

  const onClick = () => {
    if (signInUser.id) {
      commentPost(signInUser.id, thread.id, parent_id, text);
    } else {
      showMessage({ title: "ログインして下さい。", status: "error" });
      router.push("/login");
    }
  };

  return (
    <>
      {signInUser.isSignedIn ? (
        <Box bgColor="cyan.700" m={4} p={2} w="90%" borderRadius="7px">
          <Heading p={2} fontFamily="Yuji Syuku">
            コメント投稿
          </Heading>
          <FormControl isInvalid={isText}>
            <FormLabel>内容</FormLabel>
            <Textarea value={text} onChange={onChangeText} borderColor="white" bgColor="gray.600" />
          </FormControl>
          <Divider p={1} />
          <Flex flexDirection="row" align="center" marginTop={3}>
            <Spacer />
            <SecondaryButton onClick={onClick} disable={isText} loading={commentLoading}>
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
