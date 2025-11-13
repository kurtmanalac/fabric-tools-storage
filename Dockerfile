FROM hyperledger/fabric-tools:2.5
USER root
RUN apt install -y nodejs npm curl jq unzip && apt-get update

RUN mkdir -p /app/data

COPY node-api /app/node-api
RUN chmod +x /app/node-api
RUN chmod +x /app/node-api/app.js
RUN chmod +x /app/node-api/transfer-file.sh
RUN chmod +x /app/node-api/clean-zip.sh
WORKDIR /app/node-api
RUN npm install --production

CMD [ "node", "app.js" ]