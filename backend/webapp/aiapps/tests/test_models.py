from django.test import TestCase
from aiapps.models import User, Threads, Comments

class UserModelTests(TestCase):
  def test_is_empty(self):
    saved_posts = User.objects.all()
    self.assertEqual(saved_posts.count(), 0)
    
  def test_saving_and_retrieving_post(self):
    user = User()
    user.uid = '123456987qwerT'
    user.password = 'passwordPassword123'
    user.displayname = 'name'
    user.worship = '雪花ラミィ'
    user.save()
    
    saved_posts = User.objects.all()
    self.assertEqual(saved_posts.count(), 1)
    self.assertEqual(saved_posts[0].uid, '123456987qwerT')
    
class ThreadModelTests(TestCase):
  def setUp(self):
    self.user = User()
    self.user.uid = '123456987qwerT'
    self.user.password = 'passwordPassword123'
    self.user.displayname = 'name'
    self.user.worship = '雪花ラミィ'
    self.user.save()
    
  def test_is_empty(self):
    saved_posts = Threads.objects.all()
    self.assertEqual(saved_posts.count(), 0)
    
  def test_saving_and_retrieving_post(self):
    thread = Threads()
    thread.user = self.user
    thread.title = 'TestTilte'
    thread.text = 'testText'
    thread.save()    
    
    saved_posts = Threads.objects.all()
    self.assertEqual(saved_posts.count(), 1)
    self.assertEqual(saved_posts[0].title, 'TestTilte')
    
    
class CommentsModelTests(TestCase):
  def setUp(self):
    self.user = User()
    self.user.uid = '123456987qwerT'
    self.user.password = 'passwordPassword123'
    self.user.displayname = 'name'
    self.user.worship = '雪花ラミィ'
    self.user.save()
    
    self.thread = Threads()
    self.thread.user = self.user
    self.thread.title = 'TestTilte'
    self.thread.text = 'testText'
    self.thread.save()   
    
  def test_is_empty(self):
    saved_posts = Comments.objects.all()
    self.assertEqual(saved_posts.count(), 0)
    
  def test_saving_and_retrieving_post(self):
    comment = Comments()
    comment.user = self.user
    comment.threads = self.thread
    comment.text = 'testComment'
    comment.save()
    
    saved_posts = Comments.objects.all()
    self.assertEqual(saved_posts.count(), 1)
    self.assertEqual(saved_posts[0].text, 'testComment')
    
  
    
  
    