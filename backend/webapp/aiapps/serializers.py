from rest_framework import serializers, validators

from .models import UserToken, User, Images, Threads, Comments


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
  created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  
  class Meta:
    model = User
    fields = ['uid', 'displayname', 'worship', 'created_at', 'updated_at']
    
  def validate_worship(self, value):
    if value not in hololist:
      raise serializers.ValidationError("worship error")
    return value
    
  def create(self, validated_data):
    user = User.objects.create(**validated_data)
    return user

class PhotoSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True)
  uid = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True,  many=True)
  image = serializers.ImageField(use_url=True)
  is_main = serializers.BooleanField(default=False)
  class_name = serializers.ChoiceField(hololist, allow_blank=True)
  accurancy = serializers.IntegerField(max_value=100, min_value=0, allow_null=True)
  created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  class Meta:
    model = Images
    fields = ['id', 'user', 'uid', 'image', 'is_main', 'class_name', 'accurancy', 'created_at', 'updated_at']

  def create(self, validated_data):
    learningImage =  Images.objects.create(**validated_data)
    learningImage.predict()
    return learningImage
  
  
class ThreadSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True)
  uid = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
  created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  class Meta:
    model = Threads
    fields = ['id', 'user', 'uid', 'title', 'text', 'created_at', 'updated_at']
    
  def validate_title(self, value):
    if value > 30:
      raise serializers.ValidationError("title is too long")
    return value
  
  def create(self, validated_data):
    del validated_data['user']
    return Threads.objects.create(**validated_data)
  
class CommentsSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True)
  uid = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
  thread_form = ThreadSerializer(read_only=True)
  threads = serializers.PrimaryKeyRelatedField(queryset=Threads.objects.all(), write_only=True)
  created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
  
  class Meta:
    model = Comments
    fields = ['id', 'user', 'uid', 'threads', 'parent_id', 'text', 'thread_form', 'created_at', 'updated_at']
    
  def create(self, validated_data):
    del validated_data['user']
    del validated_data['thread_form']
    return Comments.objects.create(**validated_data) 
  

  