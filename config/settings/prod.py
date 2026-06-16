# from .base import *
# from decouple import config
# import dj_database_url
# import os

# DATABASES = {
#     'default': dj_database_url.config(
#         default=config('DATABASE_URL')
#     )
# }

# ALLOWED_HOSTS = ['*']
# DEBUG = False

# STATIC_URL = '/static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# CSRF_TRUSTED_ORIGINS = [
#     'https://lacofavela-grdzfab6b0bqhygj.brazilsouth-01.azurewebsites.net'
# ]

# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
# USE_X_FORWARDED_HOST = True

# INSTALLED_APPS += ['cloudinary', 'cloudinary_storage']

# DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# CLOUDINARY_STORAGE = {
#     'CLOUD_NAME': config('CLOUDINARY_CLOUD_NAME'),
#     'API_KEY': config('CLOUDINARY_API_KEY'),
#     'API_SECRET': config('CLOUDINARY_API_SECRET'),
# }
from .base import *

# Configurações de desenvolvimento
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]