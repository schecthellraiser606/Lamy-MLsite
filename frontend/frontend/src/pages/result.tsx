import { Flex, Heading } from "@chakra-ui/react";
import { ResultComment } from "../components/molecules/resultComment";
import { RankSelect } from "../components/organisms/select/rankSelect";
import axios from "axios";
import { User } from "../test/user";
import Snowfall from "react-snowfall";

const class_name = "沙花叉クロヱ";

export interface Props {
  users: Array<User>;
}

export default function ResultHome({ users }: Props) {
  return (
    <Flex align="center" justify="center" flexDirection="column">
      <Snowfall />
      <Heading as="h1" fontFamily="Yuji Syuku" margin="30px" color="white">
        あなたの真の姿は...
      </Heading>
      <ResultComment />
      <RankSelect users={users} />
    </Flex>
  );
}

export async function getStaticProps() {
  const res = await axios.get<Array<User>>("https://jsonplaceholder.typicode.com/users");
  const users = res.data;

  return {
    props: {
      users,
    },
  };
}
