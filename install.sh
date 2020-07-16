#!/bin/bash

# Production installation script for Debain 9.7

# Node installation
wget https://nodejs.org/download/release/latest-v10.x/node-v10.21.0-linux-x64.tar.xz
tar xf node-v10.21.0-linux-x64.tar.xz
cd node-v10.21.0-linux-x64
sudo cp -r lib/node_modules /usr/local/lib/
sudo cp bin/node /usr/local/bin
rm /usr/local/bin/npm
rm /usr/local/bin/npx
sudo ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm
sudo ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

# install pm2
sudo npm install pm2 -g

# Add reboot script to crontab
echo "$(echo '@reboot sleep 60 && . $HOME/.profile && cd $HOME/warihash_frontend && ./production_start.sh >> $HOME/warihash_frontend/crontab.log 2>&1' ; crontab -l)" | crontab -
