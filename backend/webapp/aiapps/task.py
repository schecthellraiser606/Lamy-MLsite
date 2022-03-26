from __future__ import absolute_import, unicode_literals
from celery import shared_task

from .predict_model import PhotoLearning

# Create your models here.
@shared_task
def ml_predict(photo):
  predicted, percentage = photo.predict()
  return [predicted, percentage]
