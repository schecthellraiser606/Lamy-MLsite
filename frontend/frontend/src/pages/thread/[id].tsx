import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { CommentBox } from "../../components/molecules/CommentBox";
import { ThreadTitle } from "../../components/molecules/threadTitle";
import { ProtectRoute } from "../../components/route/PrivateRoute";
import { Comments } from "../../types/responseType";

export interface Props {
  comments: Array<Comments>;
}

export default function ThreadDetail({ comments }: Props) {
  return (
    <ProtectRoute>
      <Flex align="center" justify="center" flexDirection="column">
        <ThreadTitle />
        <Box p={2} bg="gray.700" m={4} borderRadius="7px" padding={5}>
          <Stack>
            {comments[0] ? (
              comments.map((comment, index) => <CommentBox comment={comment} key={index} />)
            ) : (
              <Text>コメントがまだありません</Text>
            )}
          </Stack>
        </Box>
      </Flex>
    </ProtectRoute>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const param = context.params;
  const url = `http://webapp:8000/aiapps/comment_all/?thread_id=${param?.id}`;
  const res = await axios.get<Array<Comments>>(url);
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
