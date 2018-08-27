# Create Flarum Extension by ReFlar

[![npm version](https://img.shields.io/npm/v/@reflar/create-flarum-extension.svg)](https://www.npmjs.com/package/@reflar/create-flarum-extension) ![node](https://img.shields.io/node/v/@reflar/create-flarum-extension.svg)
![npm downloads](https://img.shields.io/npm/dt/@reflar/create-flarum-extension.svg)

Create a Flarum extension from a boilerplate in minutes!

[![asciicast](https://asciinema.org/a/179886.png)](https://asciinema.org/a/179886)

## Quick Overview

Using `npx` (npx comes with npm 5.2+ and higher):
```sh
npx @reflar/create-flarum-extension [dir]
```

Normally:
```sh
npm install -g @reflar/create-flarum-extension
create-flarum-extension [dir]
```


## Creating an Extension


**You’ll need to have Node >= 6.4.0 on your local development machine.** You can use [n](https://www.npmjs.com/package/n) to interactively manage your node versions.

To create a new app, run a single command:

```
npx @reflar/create-flarum-extension my-extension
```
*([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [quick overview for older npm versions](#quick-overview))*

It will create a directory called `my-extension` inside the current folder.
Inside that directory, it will generate the initial project structure:

```
my-extension
├── .gitignore
├── bootstrap.php
├── composer.json
├── LICENSE.md
├── README.md
├── js
│  ├── admin.js
│  ├── forum.js
│  ├── package.json
│  ├── src
│  │  ├── admin
│  │  │  └── index.js
│  │  └── forum
│  │     └── index.js
│  └── webpack.config.js
└── resources
   ├── less
   │  ├── admin.less
   │  └── forum.less
   └── locale
      └── en.yml
```

## Flarum Resources

- [Unofficial Flarum API Docs](https://discuss.flarum.org/d/4421-flarum-php-api-docs) - @datitisev
- [Extension development - first read](https://discuss.flarum.org/d/1662-extension-developer-first-read) - @luceos
- [Extension development - using composer](https://discuss.flarum.org/d/1608-extension-development-using-composer-repositories-path) - @luceos
- [Extension development - different workflows](https://discuss.flarum.org/d/6320-extension-developers-show-us-your-workflow)
- [Extension development - namespace tips](https://discuss.flarum.org/d/9625-flarum-extension-namespacing-tips)
