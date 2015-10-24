# Dlux Api Application
============

## Installation

First install bower and gulp

```bash
npm i -g gulp bower
```

Then install dependencies

```bash
npm install
```

```bash
bower install
```

## Development

### AngularJS Application

To start developing in the project (AngularJS part) run:

```bash
gulp serve
```

Then head to `http://localhost:3000` in your browser.

The `serve` tasks starts a static file server, which serves the AngularJS application, and a watch task which watches all files for changes and lints, builds and injects them into the index.html accordingly.


### Static Layout

To start developing in the project (static layout part) run:

```bash
gulp layout
```

Then head to `http://localhost:3333` in your browser.

The `layout` tasks starts a static file server, which serves the static layout and assets, and a watch task which watches html  files from `./static` folder and less files in `./src/app/styles` folder for changes and lints.

### Production ready build - a.k.a. dist

#### Application
To make the app ready for deploy to production run:

```bash
gulp dist
```

Now there's a `./dist` folder with all scripts and stylesheets concatenated and minified, also third party libraries installed with bower will be concatenated and minified into `vendors.min.js` and `vendors.min.css` respectively.

#### Static layout
To make the app ready for deploy to production run:
```bash
gulp static-dist
```
Now there's a `./static/output` folder with all htmls and stylesheets
