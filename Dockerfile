FROM hyperledger/fabric-tools:2.5
USER root
RUN apt-get update && apt-get install -y nodejs npm curl jq unzip && apt-get clean

# RUN mkdir -p /app/data/fabric-ca
# RUN mkdir -p /app/data/fabric-ca-server
# RUN mkdir -p /app/data/fabric-ca-client
RUN mkdir -p /app/data

COPY node-api /app/node-api
RUN chmod +x /app/node-api
RUN chmod +x /app/node-api/transfer-file.sh

CMD ["node", "node-api/app.js"]