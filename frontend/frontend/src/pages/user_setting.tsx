import { Box, Flex, Heading, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import Snowfall from "react-snowfall";
import { MyUserCreateButton } from "../components/molecules/login/myUserCreateButton";

export function getImageSrc(filepath: string): string | undefined {
  if (process.env.NODE_ENV === "production") {
    return require(`../image/radio/${filepath}.png`);
  } else {
    return require(`../image/radio/${filepath}.png`);
  }
}

export default function UserSetting() {
  const wlists = [
    "雪花ラミィ",
    "獅白ぼたん",
    "桃鈴ねね",
    "尾丸ポルカ",
    "沙花叉クロヱ",
    "ラプラスダークネス",
    "鷹嶺ルイ",
    "博衣こより",
    "風間いろは",
  ];
  const [value, setValue] = useState(wlists[0]);

  return (
    <>
      <Snowfall />
      <Heading marginLeft="50px" marginTop="20px" as="h1" fontSize={{ base: "lg", md: "3xl" }} fontFamily="Yuji Syuku">
        推しは誰？
      </Heading>
      <Text marginX="50px" as="h3" fontSize={{ base: "md", md: "xl" }}>
        ※まだログインは済んでません
        <br />
        (5，6期生しか実装できておらぬ...)
      </Text>
      <br />
      <Flex align="center" justify="center" flexDirection="column">
        <Stack>
          <Box backgroundColor="gray.700" padding="3%">
            <RadioGroup onChange={setValue} value={value}>
              <Stack spacing={4} direction={{ base: "column", lg: "row" }}>
                {wlists.map((list, index) => (
                  <Radio value={list} key={index} fontSize={{ base: "sm", lg: "mid" }}>
                    {list}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Box>
          <MyUserCreateButton value={value} />
        </Stack>
        <Box maxHeight={1500}>
          {/* @ts-ignore */}
          <Image width={850} height={1200} src={getImageSrc(value)} alt="holoimage" />
        </Box>
      </Flex>
    </>
  );
}
