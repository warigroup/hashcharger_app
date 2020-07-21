#  WariHash HashCharger Frontend App

This is a repo for HashCharger's frontend implementation. This frontend can be used as a widget on other websites as specified by [this repo](https://github.com/warigroup/hashcharger). This repo is open for implementers who wishes to make custom modifications to the HashCharger interface.

## Installation

Install [Node.js](https://nodejs.org/en/), we currently use the latest release of Node version 10.x. If you are on Debian 9.7, an installation script is provided at [install.sh](https://github.com/warigroup/hashcharger_app/blob/master/install.sh)

## Run development mode in local environment:

1. Run 'npm install'
2. Run 'npm run dev'
3. access http://localhost:3000/market/stratum.slushpool.com/3333/widgetaccount/password/sha256d/3626a5/ffffff/3626a5/233f5c/ffffff/ffffff/FRxtvCGmNWV9AqJRKAs7CB/subuser

## Run production mode on Ngnix server:

1. Run 'npm install'
2. Run 'npm run build'
3. Run 'npm start' or if using pm2 follow next instructions
4. Install pm2 package using 'npm install pm2@latest -g'
4. Run 'pm2 start npm --name "next" -- start'

- Start application's server from application’s root folder rather than running it from the production build directory.

- Please note that if you are using a custom server, you will still need to start the custom server from its resident folder rather than running next start from the production build directory (https://github.com/zeit/next.js/wiki/Deployment-on-Nginx's-reverse-proxy)

- Deployment guideline:
https://medium.com/@indiesk/deploying-a-nextjs-app-in-production-with-custom-server-using-nginx-and-pm2-786ccf9444c5

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

## Running Jest unit tests (https://jestjs.io/) and Enzyme render tests (https://airbnb.io/enzyme/)

To run the full suite execute: "npm run jest-test"
If you're on Windows OS, execute: "npm run jest-test-win"

Other testing libraries used:
* Chai (https://www.chaijs.com/)
* Nock (https://github.com/nock/nock)
* React Test Renderer (https://reactjs.org/docs/test-renderer.html)
* Enzyme Adapter React 16 (https://www.npmjs.com/package/enzyme-adapter-react-16)

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


