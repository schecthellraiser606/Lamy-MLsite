from celery import shared_task

from .forms import PhotoForm
from .predict import Photo

@shared_task
def predict(request):
  if not request.method == 'POST':
    return
    redirect('carbike:index')
    
  form = PhotoForm (request.POST, request.FILES)
  if not form.is_valid():
    raise ValueError("Formが不正です")
  
  photo = Photo(image=form.cleaned_data['image'])
  predicted, percentage = photo.predict()
  
  context = {
    'photo_name': photo.image.name,
    'photo_data': photo.image_src(),
    'predicted':predicted,
    'percentage':percentage
  }
  return context