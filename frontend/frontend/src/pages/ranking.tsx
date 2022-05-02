import { Flex, Heading } from "@chakra-ui/react";
import axios from "axios";
import Snowfall from "react-snowfall";
import { RankSelect } from "../components/organisms/select/rankSelect";
import { LearningImagee } from "../types/responseType";

export interface Props {
  imageList: Array<LearningImagee>;
}

export default function RankingPage({ imageList }: Props) {
  return (
    <Flex align="center" justify="center" flexDirection="column" height="100vh">
      <Snowfall />
      <Heading as="h1" fontFamily="Yuji Syuku" margin="30px" color="white">
        みんなのランキング
      </Heading>
      <RankSelect imageList={imageList} />
    </Flex>
  );
}

export async function getServerSideProps() {
  const url = `http://${process.env.INTERNAL_URL}:8000/aiapps/image_rank/`;
  const res = await axios.get<LearningImagee>(url);
  const imageList = res.data;

  if (!imageList) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      imageList,
    },
  };
}
