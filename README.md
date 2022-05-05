# 俺が本物のラミィだ
サービスURL：
https://www.lamy-ai-judgment.com/

![6ezuso](https://user-images.githubusercontent.com/89838264/166904830-774b73d4-e0e0-40ea-a0e2-abece3a12e92.gif)

# 概要
まずは以下の切り抜き動画を視聴してみてほしい。<br/>
切り抜き：https://youtu.be/g-e4r3za7WM

>ラ「世の中にはねぇ...そう...『俺が雪花ラミィ本物』って人もいるんですよ～」<br/>
    「頑なに自分のことを雪花ラミィだと思っているリスナーさんがおるんだけど...」 <br/>
視「俺もラミィちゃんかもしれない...」<br/>
ラ「どういう事だよ！ｗ」<br/>
    「ラミィちゃんではないだろ...」<br/>
視「案外本物かもしれないよ？...」<br/>
ラ「どういうこｔｗｗｗ」


このように自分が本物だと自称している精神異z....楽しそうな人が沢山いたようなので、本物は一体誰なのか！紛れ込んでいる不届き者はいるのか！自分はラミィちゃんだと思い込んでいる他のライバーなのではないのか？といった疑問が出てきたわけである。

そこで、本物を導くためにAIさんに判定してもらおうといった趣旨で本サービスを作成したのである。

# 使用技術
+ Frontend
    + Lang: JavaScript/TypeScript
    + FW: Next.js
    + UI library: Chakra UI
    + other: ESLint, Cypress, react-dropzone, react-snowfall ...
+ Backend
    + Lang: Python 3.7.12
    + FW: Django 3.2.12
    + other: tensorflow, djangorestframework, django-storages, Pillow, ...
+ Infra
    + AWS(ECS, ECR, RDS, ALB, S3, CloudWatch...)
    + DB: MariaDB 10.6
    + container: Docker
    + IaC: Terraform
    + Auth: Firebase Auth

# インフラ構成図
![スクリーンショット 2022-05-05 172159](https://user-images.githubusercontent.com/89838264/166905621-def06969-7ab4-4aa4-84b0-529817d3faa8.png)

# 機能群
+ AI機能
    + 画像投稿機能
    + AI判定機能
        + クラスタリング
        + 精度表示
    + プロフィール画像設定機能
+ ランキング機能
    + 月間ソート
    + AllTimeソート
    + ライバー判定ごとのソート
+ 掲示板機能
    + 掲示板作成機能
    + コメント機能
    + 返信機能
    + コメント削除機能
    