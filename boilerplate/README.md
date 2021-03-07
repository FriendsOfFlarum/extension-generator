# <%= extensionName %>

![License](https://img.shields.io/badge/license-<%= license %>-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/<%= packageName %>.svg)](https://packagist.org/packages/<%= packageName %>) [![Total Downloads](https://img.shields.io/packagist/dt/<%= packageName %>.svg)](https://packagist.org/packages/<%= packageName %>)

A [Flarum](http://flarum.org) extension. <%= packageDescription %>

### Installation

Install with composer:

```sh
composer require <%= packageName %>:"*"
```

### Updating

```sh
composer update <%= packageName %>:"*"
php flarum migrate
php flarum cache:clear
```

### Links

- [Packagist](https://packagist.org/packages/<%= packageName %>)
- [GitHub](https://github.com/<%= packageName %>)
- [Discuss](https://discuss.flarum.org/d/PUT_DISCUSS_SLUG_HERE)
