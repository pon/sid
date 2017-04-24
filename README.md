# Sid

Reusable template for risk-based applications.

![cookie monster](http://vignette1.wikia.nocookie.net/iannielli-legend/images/6/6e/Cookie_monster.jpg/revision/latest?cb=20150918140937)

# Components
The following components are included:

- **app** - [React](https://github.com/facebookincubator/create-react-app) app for serving up the application flow
- **web** - Static [Nginx](https://www.nginx.com/) server for landing pages and marketing stuff
- **web-api** - [Hapi.js](https://hapijs.com/) server for driving the application workflow (BFF + Auth)

# Quickstart

Build the images locally.
```bash
./go bootstrap
```

#### Start Application on `localhost:3000`:

`./go start app`

#### Start Web API on `localhost:4000`:

`./go start web-api`

#### Start Static Web Content on `localhost:8080`:

`./go start web`
