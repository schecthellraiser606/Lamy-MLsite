from rest_framework import authentication
from rest_framework import exceptions

from .models import UserToken

class MyAuthentication(authentication.BaseAuthentication):
  def authenticate(self, request):
      token_str = request.META.get('HTTP_AUTHORIZATION', '')
      if not token_str:
        raise exceptions.AuthenticationFailed({'message': 'token injustice.'})
      
      token = UserToken.get(token_str)
      
      if token == None :
        raise exceptions.AuthenticationFailed({'message': 'Token not found.'})
      
      if not token.check_valid_token():
        raise exceptions.AuthenticationFailed({'message': 'Token expired.'})
      
      token.update_access_datetime()
      
      return (token.user, None)