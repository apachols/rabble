## Production

&nbsp;

### Setup

```
# setup.sh
npm install -g serve
npm install -g pm2
cat "env vars plz" > ./.env
```

Also need the following:

- nvm
- node @ version ^14.4.0 (modem noises)

&nbsp;

### Deploy

```
#!/bin/bash

# cd to the hosted dir
www

# Stop the client and server applications
pm2 stop all

# pull in the latest changes
git fetch && git pull

# npm install package changes (skip if not applicable)
npm i

# create a production build
npm run build

# restart the client and server applications
pm2 start pm2.json
```

&nbsp;

### Troubleshooting

&nbsp;

Does `npm i` or `npm run build` get killed?

- Try `sudo reboot` (this worked for 1GB ram)
- Try adding 1GB swap (see DO docs)
- Add more RAM (upgraded Jan 23 to 2GB ram for easier builds)

&nbsp;

---

&nbsp;

## Local Dev

### Run locally

`npm run dev`

### Run local server

`npm run server`

### Typescript REPL

`npm run repl`

&nbsp;

---

&nbsp;

## Create React App Links

Created from the Redux Toolkit template:

- [Create React App](https://github.com/facebook/create-react-app)
- [Redux](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
