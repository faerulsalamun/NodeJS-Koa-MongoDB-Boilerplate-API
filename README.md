# NodeJS-Koa-MongoDB-Boilerplate-API
> A starter project with Node.js, Koa, MongoDB

### NodeJS Koa MongoDB Boilerplate API structure

```
├── apidocs
├── app
│   ├── controllers
│   ├── helpers
│   ├── middlewares
│   ├─── strategies
│   ├── models
│   ├─── plugins
│   ├── routes
│   ├── services
│   ├── tools
│   ├─── seed
│   ├── workers
├── config
│   ├── locales
├── .eslintignore
├── .eslintrc
├── .gitignore
├── app.js
├── CHANGELOG.md
├── LICENSE
├── NOTED.txt
├── package.json
├── README.md
└── start

```

## Installation

__Install Node Modules__

Koa requires node v7.6.0 or higher for ES2015 and async function support.

`npm install`

Make sure installed redis in your server/laptop

## Configuration

In folder config place your config, example config is fivecode.json

Seeds data :

```
NODE_ENV=fivecode node app/tools/seed/index.js
```

Generate doc :

```
apidoc -i app/ -o apidoc/
```

## Running

```
. start
```

## Todo

- [x] OAuth2 Resource Owner Password Credentials Grant
- [ ] ....

Five Code Development (https://www.five-code.com)

