from asyncore import read
from rest_framework import serializers, validators

from .models import User, Images, Threads, Comments


hololist = [ 
    "雪花ラミィ",
    "獅白ぼたん",
    "桃鈴ねね",
    "尾丸ポルカ",
    "沙花叉クロヱ",
    "ラプラスダークネス",
    "鷹嶺ルイ",
    "博衣こより",
    "風間いろは",]


class UserSerializer(serializers.ModelSerializer):
  uid = serializers.CharField(validators=[validators.UniqueValidator(queryset=User.objects.all(), message="Not Unique")])
  displayname = serializers.CharField(max_length=30)
  worship = serializers.ChoiceField(hololist)
  created_user_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  updated_user_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  
  class Meta:
    model = User
    fields = ['uid', 'displayname', 'worship', 'created_user_at', 'updated_user_at']
    
  def validate_worship(self, value):
    if value not in hololist:
      raise serializers.ValidationError("worship error")
    return value
    
  def create(self, validated_data):
    user = User.objects.create(**validated_data)
    return user 
  
class PhotoSerializer(serializers.ModelSerializer):
  uid = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True,  many=False)
  image = serializers.ImageField(use_url=True)
  is_main = serializers.BooleanField(default=False)
  class_name = serializers.ChoiceField(hololist, read_only=True)
  accurancy = serializers.IntegerField(max_value=100, min_value=0, read_only=True)
  created_image_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  updated_image_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True) 
  user = UserSerializer(read_only=True, many=False)
  class Meta:
    model = Images
    fields = ['id', 'uid', 'user', 'image', 'is_main', 'class_name', 'accurancy', 'created_image_at', 'updated_image_at']

  def create(self, validated_data):
    validated_data['user'] = validated_data.get('uid', None)
    if validated_data['user'] is None:
            raise serializers.ValidationError("user not found.") 
    del validated_data['uid']
    learningImage = Images(**validated_data)
    learningImage.predict()
    learningImage.save()
    return learningImage
  
  
class ThreadSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True, many=False)
  uid = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True, many=False)
  created_thread_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  updated_thread_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  class Meta:
    model = Threads
    fields = ['id', 'user', 'uid', 'title', 'text', 'created_thread_at', 'updated_thread_at']
    
  def validate_title(self, value):
    if len(value) >= 30:
      raise serializers.ValidationError("title is too long")
    return value
  
  def create(self, validated_data):
    validated_data['user'] = validated_data.get('uid', None)
    if validated_data['user'] is None:
            raise serializers.ValidationError("user not found.") 
    del validated_data['uid']
    return Threads.objects.create(**validated_data)
  
class CommentsSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True)
  uid = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True, many=False)
  threads = ThreadSerializer(read_only=True)
  thread_id = serializers.PrimaryKeyRelatedField(queryset=Threads.objects.all(), write_only=True, many=False)
  created_comment_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  updated_comment_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  
  class Meta:
    model = Comments
    fields = ['id', 'user', 'uid', 'threads', 'parent_id', 'parent_index', 'text', 'thread_id', 'created_comment_at', 'updated_comment_at']
    
  def create(self, validated_data):
    validated_data['user'] = validated_data.get('uid', None)
    if validated_data['user'] is None:
            raise serializers.ValidationError("user not found.") 
    del validated_data['uid']
    
    validated_data['threads'] = validated_data.get('thread_id', None)
    if validated_data['threads'] is None:
            raise serializers.ValidationError("user not found.") 
    del validated_data['thread_id']
    
    return Comments.objects.create(**validated_data) 



  