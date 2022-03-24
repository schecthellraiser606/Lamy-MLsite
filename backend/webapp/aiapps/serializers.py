from rest_framework import serializers, validators
from .models import Users, Images, Threads, Comments
from rest_framework.authtoken.models import Token

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
  uid = serializers.CharField(validators=[validators.UniqueValidator(queryset=Users.objects.all(), message="Not Unique")])
  worsihp = serializers.ChoiceField(hololist)
  
  class Meta:
    model = Users
    fields = ['uid', 'username', 'worship']
    
  def validate_worship(self, value):
    if value not in hololist:
      raise serializers.ValidationError("worship error")
    return value
    
  def create(self, validated_data):
    user = Users.objects.create_user(**validated_data)
    Token.objects.create(user=user)
    return user
  
class PhotoSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True)
  uid = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all(), write_only=True)
  class_name = serializers.ChoiceField(hololist)
  class Meta:
    model = Images
    fields = ['id', 'user', 'uid', 'image_path', 'class_name', 'accurancy']
    
  def validate_class_name(self, value):
    if value not in hololist:
      raise serializers.ValidationError("worship error")
    return value
    
  def create(self, validated_data):
    del validated_data['user']
    return Images.objects.create(**validated_data)
  
class ThreadSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True)
  uid = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all(), write_only=True)
  class Meta:
    model = Threads
    fields = ['id', 'user', 'uid', 'title', 'text']
    
  def validate_title(self, value):
    if value > 30:
      raise serializers.ValidationError("title is too long")
    return value
  
  def create(self, validated_data):
    del validated_data['user']
    return Threads.objects.create(**validated_data)
  
class CommentsSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True)
  uid = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all(), write_only=True)
  thread_form = ThreadSerializer(read_only=True)
  threads = serializers.PrimaryKeyRelatedField(queryset=Threads.objects.all(), write_only=True)
  
  class Meta:
    model = Comments
    fields = ['id', 'user', 'uid', 'threads', 'parent_id', 'text', 'thread_form']
    
  def create(self, validated_data):
    del validated_data['user']
    del validated_data['thread_form']
    return Comments.objects.create(**validated_data) 
      