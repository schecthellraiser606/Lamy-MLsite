import { Box, Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { ThreadForm } from "../../components/organisms/PostForm/threadForm";
import { Thread } from "../../types/responseType";

export interface Props {
  threads: Array<Thread>;
}

export default function ThreadIndex({ threads }: Props) {
  return (
    <Flex align="center" justify="center" flexDirection="column" w="100%" h="100vh">
      <Heading as="h1" fontFamily="Yuji Syuku" margin="30px">
        掲示板一覧
      </Heading>
      <ThreadForm />
      <Box p={2} w="90%" h="100%" bg="cyan.700" m={4} borderRadius="7px" padding={5}>
        {threads.map((thread, index) => (
          <Stack key={index}>
            <Box bg="gray.500" m={1} borderRadius="6px" p={3}>
              <Flex align="center" flexDirection="row">
                <div>
                  <Flex align="center" flexDirection="row">
                    <Heading fontSize={{ base: "md", md: "3xl" }} fontFamily="Yuji Syuku">
                      <Link href={`/thread/${thread.id}`}>
                        <a>{thread.title}</a>
                      </Link>
                    </Heading>
                  </Flex>
                  <Text m={1}>{thread.text}</Text>
                </div>
                <Spacer />
                <Flex align="center" flexDirection="column">
                  <Text>作成者</Text>
                  <Text>{thread.user.displayname}</Text>
                </Flex>
              </Flex>
            </Box>
          </Stack>
        ))}
      </Box>
    </Flex>
  );
}

export async function getStaticProps() {
  const url = "http://webapp:8000/aiapps/thread_index/?ordering=-updated_thread_at";
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
