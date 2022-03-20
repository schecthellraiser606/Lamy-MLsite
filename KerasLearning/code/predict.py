import numpy as np
from tensorflow import keras
from tensorflow.keras.models import Sequential, Model, load_model
from PIL import Image

import sys
import os

#パラメータの初期化
classes = ["雪花ラミィ", "獅白ぼたん", "桃鈴ねね", "尾丸ポルカ", "沙花叉クロヱ", "ラプラスダークネス", "鷹嶺ルイ", "博衣こより", "風間いろは"]
num_classes = len(classes)
image_size = 224
path = os.path.dirname(os.path.abspath(__file__))

#引数から画像ファイルを読み込む
image = Image.open(sys.argv[1])
image = image.convert("RGB")
image = image.resize((image_size, image_size))
data = np.asanyarray(image) /255.0
X = []
X.append(data)
X = np.array(X)

#モデルのロード
model = load_model(path + "/model_sample/vgg19_transfer.h5")

result = model.predict([X])[0]
predicted = result.argmax()
percent = int(result[predicted]*100)

print(classes[predicted], percent)