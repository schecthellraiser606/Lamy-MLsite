import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Snowfall from "react-snowfall";
import { useRecoilValue } from "recoil";
import { CommentBox } from "../../components/molecules/CommentBox";
import { ThreadTitle } from "../../components/molecules/threadTitle";
import { CommentForm } from "../../components/organisms/PostForm/commentForm";
import { userState } from "../../store/userState";
import { Comments } from "../../types/responseType";

export interface Props {
  comments: Array<Comments>;
}

export default function ThreadDetail({ comments }: Props) {
  const signInUser = useRecoilValue(userState);
  return (
    <Flex align="center" justify="center" flexDirection="column" h="100vh">
      <Snowfall />
      <ThreadTitle />
      <Box p={2} bg="gray.700" m={4} borderRadius="7px" padding={5} w="90%" overflowY="auto">
        <Stack>
          {comments[0] ? (
            comments.map((comment, index) => <CommentBox comment={comment} key={index} index={index + 1} />)
          ) : (
            <Text>コメントがまだありません</Text>
          )}
        </Stack>
      </Box>
      {signInUser.isSignedIn ? <CommentForm /> : <></>}
    </Flex>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const param = context.params;
  const url = `http://webapp:8000/aiapps/comment_all/?threads=${param?.id}`;
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
