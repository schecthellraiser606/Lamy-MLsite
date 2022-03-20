import requests
import shutil
import bs4
import os, time

wait_time = 1.5
path = os.path.dirname(os.path.abspath(__file__))
savedir = path + "/images/"
Googleurl = "https://www.google.co.jp/search"
imagenum = 400

# 保存するURLの取得
def image(data, num, val):
    # Google画像検索のURL取得
    p = {'q': data, 'safe': 'off', 'btnG':'Google+Search', 'tbm': 'isch', 'start': val}
    res = requests.get(Googleurl, params=p)
    html = res.text   # text化
    soup = bs4.BeautifulSoup(html,'lxml')   # 整形
    links = soup.find_all("img")   # img elementの取得
    link = links[num+1].get("src")   # num番目のsrcURLの取得
    return link

# 該当するURLからdownload
def download(url, file_name):
    req = requests.get(url, stream=True)
    if req.status_code == 200:
        with open(file_name + ".jpg", 'wb') as f:   # pngをbinでfileに書き出し
            req.raw.decode_content = True
            shutil.copyfileobj(req.raw, f)   # fileにpng画像データをコピー
            
# 検索する子の名前を指名してお出迎え
name = input("なんの画像収集する？:")
filepath = savedir + "/" + name + "/" + name
for val in range(0, imagenum, 20):
  for i in range(19):
    link = image(name,i, val)
    download(link, filepath + str(val+i))
    print(link)
    time.sleep(wait_time)