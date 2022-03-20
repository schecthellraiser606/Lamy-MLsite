import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
import styled from "styled-components";

type Props = {
  tcolor: string;
};

// eslint-disable-next-line react/display-name
export const Explanation: VFC<Props> = memo((props) => {
  const { tcolor } = props;
  return (
    <SDiv>
      <Box backgroundColor="white" borderRadius="md" opacity="0.7" padding="40px">
        <Heading color={tcolor} fontFamily="Yuji Syuku">
          このサイトへ辿りついた猛者へ...
        </Heading>
        <br />
        <Text color={tcolor} fontFamily="Yuji Syuku">
          <ul>
            <li>本サイトは自身を雪花ラミィだと盲信してやまない諸君へと捧げるものである。</li>
            <li>実際に自身のプロフィール画像をアップしてもらい、その画像をAI(精度はない)で判定する。</li>
            <li>
              判定が気に食わない者共、真の「雪花ラミィ」となった者共は是非とも本サイトの掲示板で意見交換を行ってほしい。
            </li>
          </ul>
          <br />
          以上だ...
        </Text>
      </Box>
    </SDiv>
  );
});

const SDiv = styled.div`
  margin-left: auto;
  padding: 0.5%;
`;
