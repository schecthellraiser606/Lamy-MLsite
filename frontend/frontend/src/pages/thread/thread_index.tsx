import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import axios from "axios";
import Snowfall from "react-snowfall";
import { ThreadBox } from "../../components/molecules/ThreadBox";
import { ThreadForm } from "../../components/organisms/PostForm/threadForm";
import { Thread } from "../../types/responseType";

export interface Props {
  threads: Array<Thread>;
}

export default function ThreadIndex({ threads }: Props) {
  return (
    <Flex align="center" justify="center" flexDirection="column" w="100%" h="100vh">
      <Snowfall />
      <Heading as="h1" fontFamily="Yuji Syuku" margin="30px">
        掲示板一覧
      </Heading>
      <ThreadForm />
      <Box p={2} w="90%" bg="cyan.700" m={4} borderRadius="7px" padding={5} overflowY="auto">
        <Heading p={2} fontFamily="Yuji Syuku">
          一覧
        </Heading>
        <Stack>
          {threads.map((thread, index) => (
            <ThreadBox thread={thread} key={index} />
          ))}
        </Stack>
      </Box>
    </Flex>
  );
}

export async function getServerSideProps() {
  const url = `http://${process.env.INTERNAL_URL}:8000/aiapps/thread_index/?ordering=-updated_thread_at`;
  const res = await axios.get<Array<Thread>>(url);
  const threads = res.data;

  if (!threads) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      threads,
    },
  };
}
