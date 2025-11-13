#!/bin/sh

curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh
bash nodesource_setup.sh
apt install -y nodejs &
INSTALL_PID=$!
wait $INSTALL_PID

npm install --prefix /app/node-api --production &
NPM_PID=$!
wait $NPM_PID

node /app/node-api/app.js