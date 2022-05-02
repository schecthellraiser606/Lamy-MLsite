#!/usr/bin/env bash
mkdir ./static
if ["${MYAPP_DOMAIN}" != ""]; then
  python manage.py collectstatic --noinput
fi
python manage.py migrate
python manage.py runserver 0.0.0.0:8000