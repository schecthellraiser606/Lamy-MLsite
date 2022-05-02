from django.test import TestCase
import json
from django.urls import reverse
from aiapps.models import User

class LoginViewTest(TestCase):
  def setUp(self):
    self.user = User()
    self.user.uid = '123456987qwerT'
    self.user.password = 'passwordPassword123'
    self.user.displayname = 'name'
    self.user.worship = '雪花ラミィ'
    self.user.save()
    
  def test_should_return_200_send_post(self):
    data = {'uid': self.user.uid}
    response = self.client.post(reverse('aiapps:login'), json.dumps(data), content_type='application/json')
    self.assertEqual(response.status_code,200)
    
  def test_should_return_400_send_post(self):
    data = {}
    response = self.client.post(reverse('aiapps:login'), json.dumps(data), content_type='application/json')
    self.assertEqual(response.status_code,400)
    
  def test_should_return_403_send_post(self):
    data = {'uid': 'aaaaaaaaa'}
    response = self.client.post(reverse('aiapps:login'), json.dumps(data), content_type='application/json')
    self.assertEqual(response.status_code,403)
    
    