FROM node:20.10.0

RUN apt update
RUN apt install -y g++ make vim
RUN echo "set mouse-=a" >> ~/.vimrc
RUN echo "syntax on" >> ~/.vimrc

WORKDIR /app

COPY . .
RUN yarn

CMD ["npm", "run", "start"]
