from django.db import models


import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import load_model
from PIL import Image
import io, base64

graph = tf.compat.v1.get_default_graph()

class PhotoLearning(models.Model):
  
    image = models.ImageField(upload_to='test_images/')
    
    IMAGE_SIZE = 224 #画像サイズの定数
    MODEL_FILE_PATH = './ml_models/vgg19_transfer.h5' #モデルファイル
    classes = ["雪花ラミィ", "獅白ぼたん", "桃鈴ねね", "尾丸ポルカ", "沙花叉クロヱ", "ラプラスダークネス", "鷹嶺ルイ", "博衣こより", "風間いろは"]
    num_classes = len(classes)
    
    def predict(self):
      model = None
      global graph
      with graph.as_default():
        model = load_model(self.MODEL_FILE_PATH)
        
        image_data = self.image.read()
        image_bin = io.BytesIO(image_data)
      
        image = Image.open(image_bin)
        image = image.convert("RGB")
        image = image.resize((self.IMAGE_SIZE, self.IMAGE_SIZE))
        data = np.asanyarray(image) /255.0
        X = []
        X.append(data)
        X = np.array(X)
        
        result = model.predict([X])[0]
        predicted = result.argmax()
        percent = int(result[predicted]*100)

        return self.classes[predicted], percent
      
    def image_src(self):
      with self.image.open() as img:
        base64_img = base64.b64encode(img.read()).decode()
        
        return 'data:' + img.file.content_type + ';base64,' + base64_img