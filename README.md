# React Slidy

React minimalistic and performant slider.

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/react-lory.svg)](https://badge.fury.io/js/react-lory)
[![npm](https://img.shields.io/npm/dm/react-lory.svg?maxAge=2592000)](https://www.npmjs.com/package/react-lory)

_Attention: This component is under heavy development still at alpha stage and its API could change. Use it on your own risk_

## Overview

React Slidy is a simple and minimal slider component. It's based on the fabulous [lory.js slider](https://github.com/meandmax/lory) altough the main idea is to move all the library javascript to React components.

## Browser compatibility

I haven't did a lot of testing on that but it's supposed to work on Firefox, Chrome, Edge, Safari and IE 10+. If not, please, fill a issue.

## Features
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
