import { Flex, Heading } from "@chakra-ui/react";
import { ResultComment } from "../components/molecules/resultComment";
import Snowfall from "react-snowfall";

export default function ResultHome() {
  return (
    <Flex align="center" justify="center" flexDirection="column">
      <Snowfall />
      <Heading as="h1" fontFamily="Yuji Syuku" margin="30px" color="white">
        あなたの真の姿は...
      </Heading>
      <ResultComment />
    </Flex>
  );
}
