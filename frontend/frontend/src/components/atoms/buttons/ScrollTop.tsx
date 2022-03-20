import { ArrowUpIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { CSSProperties, memo, useEffect, useState, VFC } from "react";

// eslint-disable-next-line react/display-name
export const ScrollTop: VFC = memo(() => {
  const [isButtonActive, setIsButtonActive] = useState(false);

  const returnTop = () => {
    window.scrollTo({
      top: 0,
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
    const top = 120; //ボタンを表示させたい位置
    let scroll = 0;
    scroll = window.scrollY;
    if (top <= scroll) {
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
    <IconButton
      bg="cyan"
      color="green.700"
      aria-label="Up to Top"
      borderRadius="50%"
      marginRight="10"
      style={style}
      onClick={returnTop}
      boxShadow="md, md"
      icon={<ArrowUpIcon />}
    />
  );
});
