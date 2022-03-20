import React from "react";
import { NextPage, NextPageContext } from "next";
import { Templete } from "../components/templetes/templete";
import { Box, Divider, Flex, Heading, Image } from "@chakra-ui/react";
interface Props {
  statusCode: number;
}

const Error: NextPage<Props> = ({ statusCode }) => {
  const photoURL = "https://source.unsplash.com/heNwUmEtZzo";
  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center" color="black">
          {statusCode}エラーが発生しました
        </Heading>
        <Divider my={4} />
        <Image boxSize="auto" borderRadius="sm" m="auto" alt="description of image" src={photoURL} />
      </Box>
    </Flex>
  );
};

Error.getInitialProps = async ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode ?? 500 : 404;
  return { statusCode };
};

export default Error;
