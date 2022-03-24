from django.db import models

# Create your models here.

class Users(models.Model):
  uid = models.CharField(max_length=45, primary_key=True)
  displayname = models.CharField(max_length=30, default='匿名')
  worship = models.CharField(max_length=10, default="その他")
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self) :
      return self.displayname
    
class Images(models.Model):
  id = models.AutoField(primary_key=True)
  uid = models.OneToOneField(Users, on_delete=models.PROTECT)
  image_path = models.ImageField(upload_to='test_images')
  class_name = models.CharField(max_length=10)
  accurancy = models.FloatField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self) :
      return self.id
    
class Threads(models.Model):
  id = models.AutoField(primary_key=True)
  uid = models.ForeignKey(Users, on_delete=models.SET_DEFAULT, default='匿名', related_name='thread_user')
  title =  models.CharField(max_length=30)
  text = models.TextField(blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self) :
      return self.title
  
class Comments(models.Model):
  id = models.AutoField(primary_key=True)
  uid = models.ForeignKey(Users, on_delete=models.SET_DEFAULT, default='匿名', related_name='comment_user')
  threads = models.ForeignKey(Threads, on_delete=models.CASCADE)
  parent_id = models.PositiveIntegerField(blank=True, null=True)
  text = models.TextField(blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self) :
      return self.id
