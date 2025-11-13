#!/bin/sh

curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh
bash nodesource_setup.sh
apt install -y nodejs

npm install --prefix ./node-api --production

node /app/node-api/app.js