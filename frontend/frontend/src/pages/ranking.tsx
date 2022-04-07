import { Flex, Heading } from "@chakra-ui/react";
import axios from "axios";
import Snowfall from "react-snowfall";
import { RankSelect } from "../components/organisms/select/rankSelect";
import { LearningImagee } from "../types/responseType";

export interface Props {
  imageList: Array<LearningImagee>;
}

export default function ResultHome({ imageList }: Props) {
  return (
    <Flex align="center" justify="center" flexDirection="column">
      <Snowfall />
      <Heading as="h1" fontFamily="Yuji Syuku" margin="30px" color="white">
        みんなのランキング
      </Heading>
      <RankSelect imageList={imageList} />
    </Flex>
  );
}

export async function getStaticProps() {
  const url = "http://localhost:8000/aiapps/image_rank/?is_main=false&ordering=-accurancy";
  const res = await axios.get<LearningImagee>(url);
  const imageList = res.data;

  return {
    props: {
      imageList,
    },
  };
}
