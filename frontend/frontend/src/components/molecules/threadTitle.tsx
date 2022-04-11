import { Box, Heading, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useRecoilValue } from "recoil";
import { threadState } from "../../store/threadState";

// eslint-disable-next-line react/display-name
export const ThreadTitle: VFC = memo(() => {
  const thread = useRecoilValue(threadState);

  return (
    <Box w="90%">
      <Heading as="h1" fontFamily="Yuji Syuku" margin="30px" color="white" textAlign="center">
        {thread.title}
      </Heading>
      <Text fontFamily="Yuji Syuku" flexWrap="wrap" textAlign="center">{thread.text}</Text>
    </Box>
  );
});
