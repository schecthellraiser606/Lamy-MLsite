from rest_framework import serializers, validators
from .models import Users, Images
from rest_framework.authtoken.models import Token

class UserSerializer(serializers.ModelSerializer):
  uid = serializers.CharField(validators=[validators.UniqueValidator(queryset=Users.objects.all(), message="Not Unique")])
  worsihp = serializers.ChoiceField([ 
    "雪花ラミィ",
    "獅白ぼたん",
    "桃鈴ねね",
    "尾丸ポルカ",
    "沙花叉クロヱ",
    "ラプラスダークネス",
    "鷹嶺ルイ",
    "博衣こより",
    "風間いろは",])
  
  class Meta:
    model = Users
    fields = ['uid', 'username', 'worship']
    
  def validate_worship(self, value):
    if value not in [ "雪花ラミィ", "獅白ぼたん", "桃鈴ねね", "尾丸ポルカ", "沙花叉クロヱ", "ラプラスダークネス", "鷹嶺ルイ", "博衣こより", "風間いろは",]:
      raise serializers.ValidationError("worship error")
    return value
    
  def create(self, validated_data):
    user = Users.objects.create_user(**validated_data)
    Token.objects.create(user=user)
    return user
  
class PhotoSerializer(serializers.ModelSerializer):
  class Meta:
    model = Images
    fields = 