#  WariHash HashCharger Frontend App

This is a repo for HashCharger's frontend implementation. This frontend can be used as a widget on other websites as specified by [this repo](https://github.com/warigroup/hashcharger). This repo is open for implementers who wishes to make custom modifications to the HashCharger interface.

## settings.js file
This file has three different settings that can be used. 
prod.settings.js has production version settings.
dev.settings.js has development version settings.
test.settings.js has test environment settings. 

## Run development mode in local environment:

1. create a brand new 'settings.js' file in root directory.
2. copy and paste in contents from dev.settings.js
3. Make sure to change [apiurl.js](https://github.com/warigroup/warihash_frontend#dynamic-api-url) to a port on localhost.
4. npm install
5. npm run dev
6. access localhost:3000

- Development mode can detect any errors in the app. However, development mode is slower than production mode.

## Run production mode in local environment:

1. create a brand new 'settings.js' file in root directory.
2. copy and paste in contents from dev.settings.js
3. Make sure to change [apiurl.js](https://github.com/warigroup/warihash_frontend#dynamic-api-url) to a port on localhost.
4. npm install
5. npm run build (this will create a production version app in .next folder)
6. npm start
7. access localhost:3000

- Production mode doesn't have any server-side error detection.

## Run production mode on Ngnix server:

1. Make sure to change [apiurl.js](https://github.com/warigroup/warihash_frontend#dynamic-api-url) to the address where API is running.
2. npm install
3. npm run build
4. install pm2 package using "npm install pm2@latest -g"
5. pm2 start npm --name "next" -- start

- Start application's server from application’s root folder rather than running it from the production build directory.

- Please note that if you are using a custom server, you will still need to start the custom server from its resident folder rather than running next start from the production build directory (https://github.com/zeit/next.js/wiki/Deployment-on-Nginx's-reverse-proxy)

- Deployment guideline:
https://medium.com/@indiesk/deploying-a-nextjs-app-in-production-with-custom-server-using-nginx-and-pm2-786ccf9444c5


## Alternative deployment method (http://pm2.keymetrics.io/docs/usage/application-declaration/)

1. Navigate to app's root directory (server.js is in root directory)
2. npm install
3. npm run build
4. install pm2 package using "npm install pm2@latest -g"
5. pm2 ecosystem   (This will generate a sample, ecosystem.config.js.)
6. Open your ecosystem.config.js file, erase its sample contents. Copy and paste in below node.js module:

```js
module.exports = {
  apps : [{
    name: 'next',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
  }]
};
```


7. pm2 start ecosystem.config.js

* Use "pm2 reload ecosystem.config.js" to reload app. Use "pm2 stop ecosystem.config.js" to stop app.
* More info: https://pm2.io/doc/en/runtime/reference/ecosystem-file/

## Running Jest unit tests (https://jestjs.io/) and Enzyme render tests (https://airbnb.io/enzyme/)

To run the full suite execute: "npm run jest-test"
If you're on Windows OS, execute: "npm run jest-test-win"

Other testing libraries used:
* Chai (https://www.chaijs.com/)
* Nock (https://github.com/nock/nock)
* React Test Renderer (https://reactjs.org/docs/test-renderer.html)
* Enzyme Adapter React 16 (https://www.npmjs.com/package/enzyme-adapter-react-16)

## Dynamic API URL

Find settings.js in root directory. Choose your API address for the app.
Make sure to use only one API address at a time.

## Add mining algorithms

Find settings.js in root directory. Add mining algorithms to 'algorithms' array.

## Add miner locations

Find settings.js in root directory. Add miner locations to 'minerLocations' array.

## Frontend libraries used:

- React.js 16.8.6 (https://reactjs.org/)
- Next.js 8.1 (http://nextjs.org/)
- Redux 4.0.1 (https://redux.js.org/)
- Axios (https://github.com/axios/axios)
- Bootstrap 4.3 (https://getbootstrap.com/)
- Styled JSX (https://github.com/zeit/styled-jsx)
- React Icons (https://react-icons.netlify.com/)
- Sweetalert (http://djorg83.github.io/react-bootstrap-sweetalert/)
- Moment Timezone (https://momentjs.com/timezone/)
- Copy to Clipboard (https://www.npmjs.com/package/copy-to-clipboard)

## Runtime environment

- Node.js (https://en.wikipedia.org/wiki/Node.js)
- Express.js (https://en.wikipedia.org/wiki/Express.js)
- PM2 (https://pm2.io/)

## Node.js 10.16.0

Make sure you have installed the latest version [Node.js](https://nodejs.org/en/), we currently use Node 10.16.0

