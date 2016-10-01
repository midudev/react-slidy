# React Slidy

React minimalistic and performant slider.

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/react-lory.svg)](https://badge.fury.io/js/react-lory)
[![npm](https://img.shields.io/npm/dm/react-lory.svg?maxAge=2592000)](https://www.npmjs.com/package/react-lory)

## Overview

React Slidy is a simple and minimal slider component. It was based on the fabulous [lory.js slider](https://github.com/meandmax/lory) altough as the main objective is to achieve the best performance and smoothness a lot of it was rewrited and cutted. Also, it's wrapped on a React component in order to be used on projects using ReactJS.

## Browser compatibility

I haven't did a lot of testing on that but it's supposed to work on Firefox, Chrome, Edge, Safari and IE 10+. If not, please, fill a issue.

## Features
* Optimized for smoothness and performance
* Lazy Loading for slider and for every slide
* Server rendering compatible

## Available Props

```
  classNameBase: PropTypes.string,
  doAfterDestroy: PropTypes.func,
  doAfterSlide: PropTypes.func,
  doBeforeSlide: PropTypes.func,
  ease: PropTypes.string,
  enableMouseEvents: PropTypes.bool,
  infinite: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number
  ]),
  lazyLoadConfig: PropTypes.object,
  onReady: PropTypes.func,
  rewind: PropTypes.bool,
  rewindSpeed: PropTypes.number,
  slideSpeed: PropTypes.number,
  slidesToScroll: PropTypes.number,
  snapBackSpeed: PropTypes.number
```

## TODO

* [ ] Add a Demo page
* [ ] Move all library slider logic to react components
* [ ] Improve documentation
* [ ] Improve server rendering compatibility
