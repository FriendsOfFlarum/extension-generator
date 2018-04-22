# Create Flarum Extension by ReFlar

Create a Flarum extension from a boilerplate in minutes!

[![asciicast](https://asciinema.org/a/177728.png)](https://asciinema.org/a/177728)

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


**You’ll need to have Node >= 8 on your local development machine (but it’s not required on the server).** You can use [n](https://www.npmjs.com/package/n) to interactively manager your node versions.

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
├── README.md
├── LICENSE.md
├── js
│  ├── admin
│  │  ├── Gulpfile.js
│  │  ├── package.json
│  │  └── src
│  │     └── main.js
│  └── forum
│     ├── Gulpfile.js
│     ├── package.json
│     └── src
│        └── main.js
├── less
│  ├── admin.less
│  └── app.less
├── locale
│  └── en.yml
└── src
   └── Listeners
      └── AddClientAssets.php
```

## Flarum Resources

- [Unofficial Flarum API Docs](https://discuss.flarum.org/d/4421-flarum-php-api-docs) - @datitisev
- [Extension development - first read](https://discuss.flarum.org/d/1662-extension-developer-first-read) - @luceos
- [Extension development - using composer](https://discuss.flarum.org/d/1608-extension-development-using-composer-repositories-path) - @luceos
- [Extension development - different workflows](https://discuss.flarum.org/d/6320-extension-developers-show-us-your-workflow)
- [Extension development - namespace tips](https://discuss.flarum.org/d/9625-flarum-extension-namespacing-tips)
