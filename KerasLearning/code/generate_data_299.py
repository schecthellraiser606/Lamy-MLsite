from PIL import Image, ImageOps
import os, glob
import numpy as np
from sklearn.model_selection import train_test_split

classes = ["雪花ラミィ", "獅白ぼたん", "桃鈴ねね", "尾丸ポルカ", "沙花叉クロヱ", "ラプラスダークネス", "鷹嶺ルイ", "博衣こより", "風間いろは"]
num_classes = len(classes)
image_size = 299 #xception向け
path = os.path.dirname(os.path.abspath(__file__))

X = []
Y = []

for index, classlabel in enumerate(classes):
  photos_dir = path + "/images/" + classlabel
  files = glob.glob(photos_dir + "/*.jpg")
  for i, file in enumerate(files):
    image = Image.open(file)
    image_flip = ImageOps.mirror(image)
    image_origin = image.convert("RGB")
    image_flip = image_flip.convert("RGB")
    image_origin = image_origin.resize((image_size, image_size))
    image_flip = image_flip.resize((image_size, image_size))
    data_origin = np.asanyarray(image_origin)
    data_flip = np.asanyarray(image_flip)
    X.extend([data_origin, data_flip])
    Y.extend([index, index])

X = np.array(X)
Y = np.array(Y)

X_train, X_test, y_train, y_test = train_test_split(X, Y)
xy = (X_train, X_test, y_train, y_test)
np.save(path + "/data_save/imagefiles_299.npy", xy)