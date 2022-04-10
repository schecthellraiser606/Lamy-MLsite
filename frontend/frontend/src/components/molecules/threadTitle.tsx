import { Heading, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useRecoilValue } from "recoil";
import { threadState } from "../../store/threadState";

// eslint-disable-next-line react/display-name
export const ThreadTitle: VFC = memo(() => {
  const thread = useRecoilValue(threadState);

  return (
    <>
      <Heading as="h1" fontFamily="Yuji Syuku" margin="30px" color="white">
        {thread.title}
      </Heading>
      <Text>{thread.text}</Text>
    </>
  );
});
