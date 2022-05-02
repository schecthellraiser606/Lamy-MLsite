#!/usr/bin/env bash
if ["${MYAPP_DOMAIN}" != ""] then;
  mkdir ./static
  python manage.py collectstatic --noinput
fi
python manage.py migrate
python manage.py runserver 0.0.0.0:8000