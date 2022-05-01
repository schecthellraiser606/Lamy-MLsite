#!/usr/bin/env bash
mkdir ./static
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py runserver 0.0.0.0:8000