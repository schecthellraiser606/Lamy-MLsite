from django.urls import path, include
from rest_framework import routers

from .views import CommentGetView, ManageCommentViewSet, ManagePhotoViewSet, ManageThreadView, ManageUserView, PhotoGetViewSet, ThreadGetViewSet, UserGetPostViewSet

app_name = 'aiapps'
router = routers.DefaultRouter()
router.register('user', UserGetPostViewSet)
router.register('image', ManagePhotoViewSet)
router.register('thread', ManageThreadView)
router.register('comment', ManageCommentViewSet)

urlpatterns = [
    path('update/', ManageUserView.as_view(), name='update'),
    path('image_rank/', PhotoGetViewSet.as_view(), name='image_rank'),
    path('thread_index/', ThreadGetViewSet.as_view(), name='thread_index'),
    path('comment_all/', CommentGetView.as_view(), name='comment_all'),
    path('', include( router.urls )),
]