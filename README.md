## Run development mode in local environment:

1. Make sure to change [apiurl.js](https://github.com/warigroup/warihash_frontend#dynamic-api-url) to a port on localhost.
2. npm install
3. npm run dev
4. access localhost:3000

- Development mode can detect any errors in the app. However, development mode is slower than production mode.

## Run production mode in local environment:

1. Make sure to change [apiurl.js](https://github.com/warigroup/warihash_frontend#dynamic-api-url) to a port on localhost.
2. npm install
3. npm run build (this will create a production version app in .next folder)
4. npm start
5. access localhost:3000

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

## Running Cypress e2e tests (https://www.cypress.io/)

Cypress is used to run e2e tests. To run the full suite execute: "npm run cypress-dashboard".
Total three cmds should be running at the same time. 

Requirements:
* The test suite requires the --test flag passed to development_start when starting the api server.
* Frontend server must be running at localhost:3000 using a different cmd with "npm run dev" command.
* Execute "npm run cypress-dashboard" on third cmd while both front end and api server are running.
* A test user credential is needed that is inserted into the database with development_install, but to manually set the credential run this command in the warihash_api root directory: 
```
pipenv run python warihash/manage.py shell -c "from orders.models import User; User.objects.create_superuser('cypress', 'test@cypress.com', 'password')"
```
To run a targeted test or only a subset of tests, the cypress dashboard can be accessed with "npm run cypress-dashboard". When the tests are run they create screenshots and compressed videos in cypress/screenshots and cypress/videos, these directories are excluded in git. 

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


