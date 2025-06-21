FROM node:18-bullseye

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN pip3 install pandas

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
