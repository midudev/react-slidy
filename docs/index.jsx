/* eslint-disable react/no-multi-comp */

import React from 'react'
import ReactDom from 'react-dom'
import ReactLory from '../src'

import SuiMultimedia from '@schibstedspain/sui-multimedia'

import docsStyle from './index.scss'

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
}, {
  src: 'https://scontent-mad1-1.cdninstagram.com/t51.2885-15/e15/11189686_499366993548088_1592806536_n.jpg',
  routerLink: '/not-found'
}]

const config = {
  enableMouseEvents: true,
  classNameBase: 'react-lory',
  slidesToScroll: 1,
  infinite: 1
}

ReactDom.render(
  <div>
    <h3>With other components</h3>
    <ReactLory {...config}>
      <SuiMultimedia lazyLoad={false} images={images[0]} />
      <SuiMultimedia lazyLoad={false} images={images[1]} />
      <SuiMultimedia lazyLoad={false} images={images[0]} />
      <SuiMultimedia lazyLoad={false} images={images[1]} />
    </ReactLory>

    <h3>Basic example</h3>
    <ReactLory {...config}>
      <img src={images[0].src} />
      <img src={images[1].src} />
      <img src={images[0].src} />
      <img src={images[1].src} />
    </ReactLory>
  </div>,
  document.getElementById('slider')
)
