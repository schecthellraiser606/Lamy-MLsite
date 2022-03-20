import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import axios from "axios";
import { CommentBox } from "../../components/molecules/CommentBox";
import { Comment } from "../../test/comments";

export interface Props {
  comments: Array<Comment>;
}

export default function ThreadDetail({ comments }: Props) {
  return (
    <Flex align="center" justify="center" flexDirection="column">
      <Heading as="h1" fontFamily="Yuji Syuku" margin="30px" color="white">
        Sample
      </Heading>
      <Box p={2} bg="gray.700" m={4} borderRadius="7px" padding={5}>
        <Stack>
          {comments.map((comment, index) => (
            <CommentBox comment={comment} key={index} />
          ))}
        </Stack>
      </Box>
    </Flex>
  );
}

export async function getServerSideProps() {
  const res = await axios.get<Array<Comment>>("https://jsonplaceholder.typicode.com/comments");
  const comments = res.data;

  if (!comments) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      comments,
    },
  };
}
