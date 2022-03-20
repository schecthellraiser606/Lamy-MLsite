import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { Thread } from "../../test/thread";

export interface Props {
  threads: Array<Thread>;
}

export default function ThreadIndex({ threads }: Props) {
  return (
    <Flex align="center" justify="center" flexDirection="column">
      <Heading as="h1" fontFamily="Yuji Syuku" margin="30px">
        掲示板一覧
      </Heading>
      <Box p={2} bg="cyan.700" m={4} borderRadius="7px" padding={5}>
        {threads.map((thread, index) => (
          <Stack key={index}>
            <Box bg="gray.500" m={1} borderRadius="6px" p={3}>
              <Flex align="center" flexDirection="row">
                <Heading fontSize={{ base: "md", md: "3xl" }} fontFamily="Yuji Syuku">
                  <Link href={`/thread/${thread.id}`}>
                    <a>{thread.title}</a>
                  </Link>
                </Heading>
              </Flex>
              <Text m={1}>sample</Text>
            </Box>
          </Stack>
        ))}
      </Box>
    </Flex>
  );
}

export async function getStaticProps() {
  const res = await axios.get<Array<Thread>>("https://jsonplaceholder.typicode.com/todos");
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
