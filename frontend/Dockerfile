FROM node:17

WORKDIR /home/app/frontend
COPY ./frontend /home/app/frontend/

RUN npm update npm &&\
    chmod 744 ./startup.sh

EXPOSE 3000

ENV CI=true