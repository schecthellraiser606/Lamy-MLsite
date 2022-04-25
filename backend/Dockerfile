FROM python:3.7.12

ENV PYTHONUNBUFFERED=1  \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUTF8=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=on

WORKDIR /code
ADD requirements.txt /code/

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY ./webapp /code/

EXPOSE 8000