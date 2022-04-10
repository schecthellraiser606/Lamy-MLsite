import { Button } from "@chakra-ui/react";
import { CSSProperties, memo, useEffect, useState, VFC } from "react";

// eslint-disable-next-line react/display-name
export const ScrollBottom: VFC = memo(() => {
  const [isButtonActive, setIsButtonActive] = useState(false);

  const GoBottom = () => {
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scrollTo({
      top: bottom,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollWindow);
    return () => {
      window.removeEventListener("scroll", scrollWindow);
    };
  }, []);

  const scrollWindow = () => {
    const bottom = 120; //ボタンを表示させたい位置
    let scroll = 0;
    scroll = window.scrollY;
    if (bottom >= scroll) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  };

  const normalStyle: CSSProperties | undefined = {
    opacity: 0,
    transition: "0.5s",
    pointerEvents: "none",
  };
  const activeStyle: CSSProperties | undefined = {
    opacity: 1,
    transition: "0.5s",
    margin: "auto",
  };
  const style = isButtonActive ? activeStyle : normalStyle;

  return (
    <Button
      bg="cyan"
      color="green.700"
      aria-label="Go to Bottom"
      borderRadius="5%"
      marginRight="10"
      style={style}
      onClick={GoBottom}
      boxShadow="md, md"
    >
      最新の投稿へ
    </Button>
  );
});
