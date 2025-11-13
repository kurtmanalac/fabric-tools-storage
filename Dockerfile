FROM hyperledger/fabric-tools:2.5
USER root
RUN apt-get update && apt-get install -y curl jq unzip

RUN mkdir -p /app/data

COPY node-api /app/node-api
RUN chmod +x /app/node-api
RUN chmod +x /app/node-api/app.js
RUN chmod +x /app/node-api/transfer-file.sh
RUN chmod +x /app/node-api/clean-zip.sh
COPY install-files.sh /app/install-files.sh
RUN chmod +x /app/install-files.sh
WORKDIR /app

CMD [ "/app/install-files.sh" ]