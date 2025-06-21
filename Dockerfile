FROM node:18-bullseye

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    pip3 install --upgrade pip

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN pip3 install pandas

RUN python3 -V

RUN npm run build

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
