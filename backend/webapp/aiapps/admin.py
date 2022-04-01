from django.contrib import admin

from .models import Comments, Images, Threads, UserToken, Users

# Register your models here.

admin.site.register(Images)
admin.site.register(Threads)
admin.site.register(Comments)
admin.site.register(Users)
