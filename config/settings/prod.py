from .base import *
from decouple import config
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL')
    )
}

INSTALLED_APPS += ['cloudinary', 'cloudinary_storage']

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': config('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': config('CLOUDINARY_API_KEY'),
    'API_SECRET': config('CLOUDINARY_API_SECRET'),
}