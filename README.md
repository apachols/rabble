## Production

```
# setup.sh
npm install -g serve
npm install -g pm2
cat "env vars plz" > ./.env

# build.sh (run this locally, it dies hard on a digital ocean droplet...)
npm run build
tar -zcvf ./build/build.tar.gz ./build
scp ./build/build.tar.gz $USER@$DOMAIN:$WORKDIR/build.tar.gz

# stop.sh
pm2 stop all

# deploy.sh
rm -rf build/*
tar -zxvf build.tar.gz
rm build.tar.gz

# start.sh
pm2 start pm2.json
```

## Local Dev

### Run locally

`npm run dev`

### Run local server

`npm run server`

### Typescript REPL

`npm run repl`

---

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.
