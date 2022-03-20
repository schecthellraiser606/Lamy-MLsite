import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { DropZone } from "../components/molecules/image/Dropzone";
import { Explanation } from "../components/atoms/text/Explanation";
import styled, { keyframes } from "styled-components";
import Snowfall from "react-snowfall";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Snowfall />
        <LamyHead>
          俺が本物の...
          <br />
          　　ラミィだ...
        </LamyHead>
        <DropZone />
        <Explanation tcolor="black" />
      </main>
    </div>
  );
};

const Animation = keyframes`
  0%, 100% {
    /* 明るく光るよう影を重ねる */
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #00dafc, 0 0 70px #00dafc, 0 0 80px #00dafc, 0 0 100px #00dafc, 0 0 150px #0097fc;
  }
  50% {
    /* 淡く光るよう影を重ねる */
    text-shadow: 0 0 10px #fff, 0 0 20px #f2feff, 0 0 30px #f2feff, 0 0 40px #2ef1ff;
  }
`;
const LamyHead = styled.div`
  font-family: Yuji Syuku;
  font-size: 40px;
  color: #808080;

  animation: ${Animation} 1s infinite;
`;

export default Home;
