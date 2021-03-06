from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser

import hashlib
from datetime import timedelta

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import load_model
from PIL import Image
import io, base64

graph = tf.compat.v1.get_default_graph()
image_SIZE = 224 #画像サイズの定数
model_FILE_PATH = './aiapps/ml_models/vgg19_transfer.h5' #モデルファイル
hololist = ["雪花ラミィ", "獅白ぼたん", "桃鈴ねね", "尾丸ポルカ", "沙花叉クロヱ", "ラプラスダークネス", "鷹嶺ルイ", "博衣こより", "風間いろは"]

# Create your models here.

class User(AbstractUser):
  uid = models.CharField(max_length=50, primary_key=True, unique=True)
  password = models.CharField(max_length=20, default="741852369")
  displayname = models.CharField(max_length=30, default='匿名')
  username = models.CharField(max_length=10, blank=True, unique=False)
  worship = models.CharField(max_length=10, default="その他")
  created_user_at = models.DateTimeField(auto_now_add=True)
  updated_user_at = models.DateTimeField(auto_now=True)
  
  USERNAME_FIELD = 'uid'
  
  def __str__(self) :
      return self.displayname
    
class UserToken(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'user_token')
  token =models.CharField(max_length=128)
  access_datetime = models.DateTimeField()
  
  def __str__(self):
        # メールアドレスとアクセス日時、トークンが見えるようにする
        dt = timezone.localtime(self.access_datetime).strftime("%Y/%m/%d %H:%M:%S")
        return self.user.displayname + '(' + dt + ') - ' + self.token
      
  @staticmethod
  def create(user: User):
     if UserToken.objects.filter(user=user).exists():
       UserToken.objects.get(user=user).delete() #すでに存在した場合は削除
     dt = timezone.now()
     str = user.uid + user.worship + dt.strftime('%Y%m%d%H%M%S%f')
     hash = hashlib.sha512(str.encode('utf-8')).hexdigest()
     token = UserToken.objects.create(
            user = user,
            token = hash,
            access_datetime = dt)
     return token
   
  @staticmethod
  def get(token_str: str):
      # 引数のトークン文字列が存在するかチェック
      if UserToken.objects.filter(token=token_str).exists():
          return UserToken.objects.get(token=token_str)
      else:
          return None
        
  def check_valid_token(self):
    delta = timedelta(minutes=30)
    if(delta < timezone.now() - self.access_datetime):
      return False
    return True
  
  def update_access_datetime(self):
    self.access_datetime = timezone.now()
    
class Images(models.Model):
  id = models.AutoField(primary_key=True)
  user = models.ForeignKey(User, to_field="uid", on_delete=models.CASCADE, related_name = 'user_image')
  image = models.ImageField(upload_to='images')
  is_main = models.BooleanField(default=False)
  class_name = models.CharField(max_length=10, blank=True)
  accurancy = models.PositiveIntegerField(blank=True, null=True)
  created_image_at = models.DateTimeField(auto_now_add=True)
  updated_image_at = models.DateTimeField(auto_now=True)
  
  def __str__(self) :
      return self.id
    
  def predict(self):
      model = None
      global graph
      with graph.as_default():
        model = load_model(model_FILE_PATH)
        
        print(self.image)
        image_data = self.image.read()
        image_bin = io.BytesIO(image_data)
      
        image = Image.open(image_bin)
        image = image.convert("RGB")
        image = image.resize((image_SIZE, image_SIZE))
        data = np.asanyarray(image) /255.0
        X = []
        X.append(data)
        X = np.array(X)
        
        result = model.predict([X])[0]
        predicted = result.argmax()
        self.class_name = hololist[predicted]
        self.accurancy = int(result[predicted]*100)
      
  def image_src(self):
      with self.image.open() as img:
        base64_img = base64.b64encode(img.read()).decode()
        
        return 'data:' + img.file.content_type + ';base64,' + base64_img
    
class Threads(models.Model):
  id = models.AutoField(primary_key=True)
  user = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default='anonymous', related_name='user_thread')
  title =  models.CharField(max_length=30)
  text = models.TextField(blank=True)
  created_thread_at = models.DateTimeField(auto_now_add=True)
  updated_thread_at = models.DateTimeField(auto_now=True)
  
  def __str__(self) :
      return self.title
  
class Comments(models.Model):
  id = models.AutoField(primary_key=True)
  user = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default='anonymous', related_name='user_comment')
  threads = models.ForeignKey(Threads, on_delete=models.CASCADE, related_name='comment_thread')
  parent_id = models.PositiveIntegerField(blank=True, null=True)
  parent_index = models.PositiveIntegerField(blank=True, null=True)
  text = models.TextField(default='No Data')
  created_comment_at = models.DateTimeField(auto_now_add=True)
  updated_comment_at = models.DateTimeField(auto_now=True)
  
  def __str__(self) :
      return self.id
    