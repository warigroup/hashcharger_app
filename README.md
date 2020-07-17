#  WariHash HashCharger Frontend App

This is a repo for HashCharger's frontend implementation. This frontend can be used as a widget on other websites as specified by [this repo](https://github.com/warigroup/hashcharger). This repo is open for implementers who wishes to make custom modifications to the HashCharger interface.

## Run development mode in local environment:

1. Run 'npm install'
2. Run 'npm run dev'
3. access http://localhost:3000/market/stratum.slushpool.com/3333/widgetaccount/password/sha256d/3626a5/ffffff/3626a5/233f5c/ffffff/ffffff/Wz4okAcgswSbB7rm5XD2kf/subuser

* Our public API will not allow you to fetch data from your local machine. Please deploy your app on a server to fully test this application.

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

## Node.js 10.16.0

Make sure you have installed the latest version [Node.js](https://nodejs.org/en/), we currently use Node 10.16.0

