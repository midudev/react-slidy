# sui-multimedia

## Description
The SUI-Multimedia component allows us to render an image or list of images, taking the whole width of its parent. Links on images are optional.

## Demo page
Check out the [demo page](http://sui-components.github.io/sui-multimedia/).

## Usage
Render component passing a required array of objects: `images`, containing (each object) the following properties:
* `src`: Required param to print the desired image.
*  `defaultSrc`: Optional param to print a default image if the request for the main one fails.
* `alt`: Required param to print the "alt" image attribute, and also the link title if has one.
* `link`: Optional param to set a link on the image.
* `routerLink`: Optional param to set a React Router link on the image.

You can also pass a prop `lazyLoad` in order to enable/disable this functionality for your images. Defaults to `true`.

An example of the `sui-multimedia` component implementation is:

```javascript
// JSX file.
const images = [{
  src: 'https://scontent-mad1-1.cdninstagram.com/t51.2885-15/e15/11189686_499366993548088_1592806536_n.jpg',
  alt: 'Bicing Old town Barcelona',
  link: 'https://www.instagram.com/p/UCYp_ypMkN/?taken-by=davecarter'
}, {
  src: 'https://scontent-mad1-1.cdninstagram.com/t51.2885-15/e15/10748230_299848506868376_514084448_n.jpg?ig_cache_key=ODQ2NjYxNzQzOTY4OTc4Njcw.2',
  alt: 'Morning rain'
}, {
  src: 'http://www.foo.com/not-found.png',
  alt: 'Not Found',
  routerLink: '/not-found'
}, {
  src: 'http://www.foo.com/not-found.png',
  alt: 'Not Found',
  defaultSrc: './img/default_src.png'
}];

ReactDom.render(
  <SuiMultimedia images={images} />,
  document.getElementById('multimedia')
);
```

## Installation
Clone this repository and run:
```
$ npm install
```

## Start working in development mode:
```
$ npm run dev
```
This command will build your `.sass`, `.jsx` and `.js` files and open a local development environment, with hot reloading. A browser window will be opened as well, showing the entry point of your documents folder for development purposes.

## To work in TDD mode:
```
$ npm run test:watch
```
## To run unit tests only once:
```
$ npm test
```
## To publish yours docs page:
```
$ npm run doc
```

That will publish in a gh-page for `docs` folder. What is a component without a [public demo](http://sui-components.github.io/sui-multimedia/), isn't it ?!
