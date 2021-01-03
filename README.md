## Production

### Setup

```
# setup.sh
npm install -g serve
npm install -g pm2
cat "env vars plz" > ./.env
```

### Build

Since react-scripts 4, you'll need to build locally and scp the build to digital ocean :|

```
#!/bin/bash

REACT_APP_API_ROOT=?? \
REACT_APP_SOCKET_ROOT=?? \
npm run build

PROJDIR="??"
ZIPNAME="??"
BUILDDIR="??"
TARFILE="??"
TARGETPATH="??"
$HOST="??"

#
cd $PROJDIR && tar -zcvf $TARFILE $BUILDDIR

#
scp $TARFILE $HOST:$TARGETPATH$ZIPNAME

#
rm $TARFILE
```

### Deploy

```
#!/bin/bash

WWW="??"

pm2 stop all
rm -rf $WWW/build/*
tar -zxvf $WWW/build.tar.gz
rm $WWW/build.tar.gz
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
