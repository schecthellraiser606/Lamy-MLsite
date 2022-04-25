FROM node:17

WORKDIR /home/app/frontend
COPY ./frontend /home/app/frontend/

RUN npm update npm 

EXPOSE 3000

ENV CI=true

CMD ["npm", "run", "start"]