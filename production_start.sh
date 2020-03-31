#!/bin/bash
# This is a script to start the frontend in production

PATH=$PATH:/usr/local/bin

CONFIG_FILENAME=$1

if [ ! -z "$1" ]
then
    cp settings/$1 settings.js
    echo "utilizing $1"
fi

npm run build
pm2 stop 0
pm2 delete 0
pm2 start npm --name "next" -- start

