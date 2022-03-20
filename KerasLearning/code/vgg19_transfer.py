import numpy as np
from tensorflow import keras
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import Dense, Dropout, Flatten
from tensorflow.keras.layers import Conv2D, MaxPooling2D
from tensorflow.keras.optimizers import SGD, Adam
from tensorflow.python.keras.models import Model
from tensorflow.python.keras.utils import np_utils
from tensorflow.keras.applications import vgg19
import os

#パラメータの初期化
classes = ["雪花ラミィ", "獅白ぼたん", "桃鈴ねね", "尾丸ポルカ", "沙花叉クロヱ", "ラプラスダークネス", "鷹嶺ルイ", "博衣こより", "風間いろは"]
num_classes = len(classes)
image_size = 224
path = os.path.dirname(os.path.abspath(__file__))

#データの読み込み正規化
X_train, X_test, y_train, y_test = np.load(path + "/data_save/imagefiles_224.npy", allow_pickle=True)
y_train = np_utils.to_categorical(y_train, num_classes)
y_test = np_utils.to_categorical(y_test, num_classes)
X_train = X_train.astype("float")/255.0
X_test = X_test.astype("float")/255.0

# model定義
model = vgg19.VGG19(weights='imagenet', include_top=False, input_shape=(image_size, image_size, 3))
# model.summary()

top_model = Sequential()
top_model.add(Flatten(input_shape=model.output_shape[1:]))
top_model.add(Dense(256, activation='relu'))
top_model.add(Dropout(0.5))
top_model.add(Dense(num_classes, activation='softmax'))

model = Model(inputs=model.input, outputs=top_model(model.output))

for layer in model.layers[:15]:
  layer.trainable = False


opt = Adam(lr=0.0001)
model.compile(loss='categorical_crossentropy', optimizer=opt, metrics=['accuracy'])
model.fit(X_train, y_train, batch_size=32, epochs=14)

score = model.evaluate(X_test, y_test, batch_size=32)

model.save("./model_sample/vgg19_transfer.h5")