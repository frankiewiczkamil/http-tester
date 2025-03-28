FROM node:22

WORKDIR /app

RUN apt-get update && apt-get install -y iproute2

COPY package*.json ./
RUN npm install

COPY generate-cert.sh ./
RUN chmod +x generate-cert.sh
COPY public ./public
COPY certs ./certs
COPY *.js ./


EXPOSE 18443
EXPOSE 28443

CMD tc qdisc add dev eth0 root netem loss 50%; npm start