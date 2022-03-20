import { Box, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { memo, VFC } from "react";
import { useRecoilValue } from "recoil";
import { predictState } from "../../store/predictState";

function comment(className: string) {
  let texts = "";
  switch (className) {
    case "雪花ラミィ":
      texts =
        "お主は正真正銘の雪花ラミィである。紛うことなき酒豪として名乗ることができるであろう。これらからも大喜利を楽しむのじゃ";
      break;
    case "獅白ぼたん":
      texts =
        "お主は自身を雪花ラミィと思い込んでおる獅白ぼたんじゃ。尻尾が見えておるぞ...バレたからって何をゲラゲラしておるのじゃ？";
      break;
    case "桃鈴ねね":
      texts =
        "お主は自身を雪花ラミィと思い込んでおる桃鈴ねねじゃ。きんたまきらきら金曜日が待ち遠しいのじゃ。...ニートのワシを雇っておくれ...";
      break;
    case "尾丸ポルカ":
      texts =
        "お主は自身を雪花ラミィと思い込んでおる尾丸ポルカじゃ。伝説を作ることに長けておるお主は雪花ラミィと思い込んでも仕方ないの。雪花ラミィになって何をしでかすつもりじゃ？";
      break;
    case "沙花叉クロヱ":
      texts =
        "お主は自身を雪花ラミィと思い込んでおるスロ叉カ...沙花叉クロヱじゃ。匂うぞ！風呂に入るのじゃ！！ぽえぽえじゃない！！！風呂に入れ！！！！！";
      break;
    case "ラプラスダークネス":
      texts =
        "お主は自身を雪花ラミィと思い込んでおるラプラスダークネスじゃ。耳舐めASMRをみれば直ぐにわかったぞ？...YMD！YMD！そーれ！YMD！！！";
      break;
    case "鷹嶺ルイ":
      texts =
        "お主は自身を雪花ラミィと思い込んでおる鷹嶺ルイじゃ。「叫んだら即終了」企画の速度を計測すれば判断可能じゃろう。床は拭いておくのじゃぞ？";
      break;
    case "博衣こより":
      texts =
        "お主は自身を雪花ラミィと思い込んでおる博衣こよりじゃ。HoloXの頭脳といえど、脳内ピンクコヨーテじゃからな...ワシ直伝のセンシティブ判定には敵わなかったようじゃな。";
      break;
    case "風間いろは":
      texts =
        "お主は自身を雪花ラミィと思い込んでおる風間いろはじゃ。誰も本来の姿を目撃したことがない生粋の忍者じゃ。ワシも変化の術に騙される所じゃった、さすが忍者じゃ。にんにん！！";
      break;

    default:
      texts = "すまんな、何かエラーが出ており、判定出来なんだ。最初に戻って再度画像をアップロードしておくれ。";
      break;
  }

  return texts;
}

export function getImageSrc(filepath: string): string | undefined {
  if (process.env.NODE_ENV === "production") {
    return require(`../../image/result/${filepath}.png`);
  } else {
    return require(`../../image/result/${filepath}.png`);
  }
}

// eslint-disable-next-line react/display-name
export const ResultComment: VFC = memo(() => {
  const predict = useRecoilValue(predictState);

  return (
    <Box bg="gray.700" padding={{ base: 3, md: 5 }} w={{ base: "xs", md: "3xl" }}>
      <Heading fontFamily="Yuji Syuku" margin="auto" color="aquamarine" p={5} textAlign="center">
        {predict.class_name}
      </Heading>
      {/* @ts-ignore */}
      <Image layout="responsive" src={getImageSrc(predict.class_name)} alt="predict" />
      <Text fontSize="lg" p={5} color="white">
        {comment(predict.class_name)}
      </Text>
    </Box>
  );
});
