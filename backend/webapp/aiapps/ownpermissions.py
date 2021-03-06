from rest_framework import permissions


class ProfilePermission(permissions.BasePermission):
  def has_object_permission(self, request, view, obj):
      if request.method in permissions.SAFE_METHODS:
        return True
      return False
    
class OwnObjectPermission(permissions.BasePermission):
  def has_object_permission(self, request, view, obj):
    return obj.user == request.user
  
class NoDeletePermission(permissions.BasePermission):
  def has_object_permission(self, request, view, obj):
      if request.method != 'DELETE':
        return True
      return False
    
