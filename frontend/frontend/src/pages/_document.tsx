import Document, { Html, Head, Main, NextScript } from "next/document";
import {ServerStyleSheet} from 'styled-components';

const url = "<https://example.com>";
const title = "俺が本物のラミィだ";
const description = "我こそはホロライブ所属の雪花ラミィと云う者、ここに集まれり";

type Props = {
  styleTags: any;
};


export default class MyDocument extends Document<Props> {
  static getInitialProps({renderPage}) {
    const sheet = new ServerStyleSheet();

    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />),
    );

    const styleTags = sheet.getStyleElement();

    return {...page, styleTags};
  }
  //URL編集必須

  render(){ return (
    <Html lang="ja-JP">
      <Head>
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        {this.props.styleTags}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );}
};
