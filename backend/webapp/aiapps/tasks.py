from __future__ import absolute_import, unicode_literals
from celery import shared_task

from .predict_model import PhotoLearning

# Create your models here.
@shared_task
def ml_predict(img):
  photo = PhotoLearning(image=img)
  predicted, percentage = photo.predict()
  imgdata = photo.image_src()
  return {
      'photo_data':imgdata, 
      'predicted':predicted, 
      'percentage':percentage
    }
