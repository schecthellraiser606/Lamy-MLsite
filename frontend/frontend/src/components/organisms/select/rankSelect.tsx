import { ChangeEvent, memo, useState, VFC } from "react";
import { Box, Flex, Text, Divider, Select, ChakraProvider, Spacer, Stack, Image } from "@chakra-ui/react";
import themeSelect from "../../../styles/themeSelect";
import { LearningImagee } from "../../../types/responseType";
import { useImageFilter } from "../../../hooks/image/imageFilter";
import useIsomorphicLayoutEffect from "../../../hooks/canUseDom";

type Props = {
  imageList: Array<LearningImagee>;
};

function rankColor(rank: number) {
  let color = "";
  switch (rank) {
    case 0:
      color = "red";
      break;
    case 1:
      color = "#FF6A00";
      break;
    case 2:
      color = "orange";
      break;
    default:
      color = "brack";
      break;
  }
  return color;
}

// eslint-disable-next-line react/display-name
export const RankSelect: VFC<Props> = memo((prop) => {
  const { imageList } = prop;

  const { filterImage, filterWorship } = useImageFilter();

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
  const term = ["month", "all time"];

  const [holo, setHolo] = useState(wlists[0]);
  const [time, setTime] = useState(term[0]);

  useIsomorphicLayoutEffect(() => {
    const para = { worship: holo, month: time, imageList: imageList };
    filterWorship(para);
  }, [holo, imageList, time]);

  const onChangeHolo = (e: ChangeEvent<HTMLSelectElement>) => setHolo(e.target.value);
  const onChangeTime = (e: ChangeEvent<HTMLSelectElement>) => setTime(e.target.value);

  return (
    <Box p={2} bg="gray.200" m={4} borderRadius="7px" overflowY="auto">
      <ChakraProvider theme={themeSelect}>
        <Flex flexDirection="row" align="center" justifyContent="center">
          <Text
            w={{ base: "150px", md: "lg" }}
            p={2}
            color="black"
            fontSize={{ base: "xl", md: "3xl" }}
            fontFamily="Yuji Syuku"
            marginLeft={{ base: 1, md: 10 }}
            textDecorationLine="underline "
          >
            ランキング
          </Text>
          <Spacer />
          <Stack>
            <Select size="md" borderWidth={2} borderColor="black" value={holo} onChange={onChangeHolo}>
              {wlists.map((list, index) => (
                <option value={list} key={index}>
                  {list}
                </option>
              ))}
            </Select>
            <Select size="md" borderWidth={2} borderColor="black" value={time} onChange={onChangeTime}>
              {term.map((list, index) => (
                <option value={list} key={index}>
                  {list}
                </option>
              ))}
            </Select>
          </Stack>
        </Flex>
        <Divider margin={2} />
        {filterImage ? (
          filterImage?.map((image, index) => (
            <Flex flexDirection="row" align="center" key={index}>
              <Box p={1} marginRight={5}>
                {/* @ts-ignore */}
                <Image width={10} height={10} src={image.image} alt="rank" />
              </Box>
              <Stack>
                <Text>{image.user.displayname}</Text>
                <Text>AI精度：{image.accurancy}</Text>
              </Stack>
              <Spacer />
              <Text fontSize={{ base: 30, md: 40 }} color={rankColor(index)} fontFamily="Yuji Syuku">
                {index + 1}位
              </Text>
            </Flex>
          ))
        ) : (
          <Flex flexDirection="column" align="center">
            <Text color="black">投稿された画像がありません</Text>
          </Flex>
        )}
      </ChakraProvider>
    </Box>
  );
});
