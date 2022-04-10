import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { memo, VFC } from "react";
import { useSetRecoilState } from "recoil";
import { threadState } from "../../store/threadState";
import { Thread } from "../../types/responseType";

type Props = {
  thread: Thread;
  key: number;
};

// eslint-disable-next-line react/display-name
export const ThreadBox: VFC<Props> = memo((props) => {
  const { thread } = props;
  const router = useRouter();
  const setThread = useSetRecoilState(threadState);

  const onClick = () => {
    setThread(thread);
    router.push({
      pathname: "/thread/[id]",
      query: { id: thread.id },
    });
  };

  return (
    <Box bg="gray.600" m={1} borderRadius="6px" p={3}>
      <Flex align="center" flexDirection="row">
        <div>
          <Flex align="center" flexDirection="row">
            <Heading fontSize={{ base: "md", md: "3xl" }} fontFamily="Yuji Syuku" onClick={onClick}>
              {thread.title}
            </Heading>
          </Flex>
          <Text m={1}>{thread.text}</Text>
        </div>
        <Spacer />
        <Flex align="center" flexDirection="column">
          <Text fontFamily="Yuji Syuku">作成者</Text>
          <Text fontFamily="Yuji Syuku">{thread.user.displayname}</Text>
        </Flex>
      </Flex>
    </Box>
  );
});
