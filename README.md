# Sid

Reusable template for risk-based applications.

![cookie monster](http://vignette1.wikia.nocookie.net/iannielli-legend/images/6/6e/Cookie_monster.jpg/revision/latest?cb=20150918140937)

# Components
The following components are included:

- **app** - [React](https://github.com/facebookincubator/create-react-app) app for serving up the application flow
- **app-api** - [Hapi.js](https://hapijs.com/) server for driving the application workflow (BFF + Auth)
- **web** - Static [Nginx](https://www.nginx.com/) server for landing pages and marketing stuff
- **emailer** - SQS task consumer for sending templated emails
- **knowledge-base** - API for application-based data (addresses, profile, employment, leases, etc.)
- **RStudio** - IDE for local R development

# Quickstart

Build the images locally.
```bash
./go bootstrap
```

#### Start Application on `localhost:3000`:

`./go start app`

#### Start Application API on `localhost:4000`:

`./go start app-api`

#### Start Static Web Content on `localhost:8080`:

`./go start web`

#### Start Emailer Task Consumer:

`./go start emailer`

#### Start Knowledge Base API on `localhost:5000`:

`./go start knowledge_base`

#### Start RStudio in Browser at `localhost:8787`:

`./go start r_studio`
