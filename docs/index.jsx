/* eslint-disable react/no-multi-comp */

import React, {Component} from 'react'
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
  src: 'https://instagram.fmad3-1.fna.fbcdn.net/t51.2885-15/e15/11190907_496126760539748_273622403_n.jpg?ig_cache_key=MzEyMjIxNDA0NDc3MzExNzEy.2',
  alt: 'Train'
}, {
  src: 'https://instagram.fmad3-1.fna.fbcdn.net/t51.2885-15/e15/11193129_1465144090443130_787558483_n.jpg?ig_cache_key=MzIyNDE3MzI5NzU3ODAxMzk0.2',
  alt: 'Barcelona rain'
}, {
  src: 'https://instagram.fmad3-1.fna.fbcdn.net/t51.2885-15/e15/11116616_484078385076616_1251856526_n.jpg?ig_cache_key=MzE5NjE0NDY4MjE2OTAwMjQ2.2',
  alt: 'Music'
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

const handlers = {
  doAfterSlide: ({currentSlide}) => console.log(currentSlide),
  doAfterDestroy: ({event}) => console.log(event)
}

const config = {
  enableMouseEvents: true,
  classNameBase: 'react-lory',
  slidesToScroll: 1,
  infinite: false,
  ...handlers
}

class App extends Component {

  constructor (...args) {
    super(...args)
    this.state = { mounted: true, currentSlide: 0 }
  }

  componentWillReceiveProps ({mounted}) {
    this.setState({mounted})
  }

  render () {
    return (<div>
    {this.state.mounted &&
      <div>
        <h3>Only one image</h3>
        <ReactLory {...config}>
          <SuiMultimedia lazyLoad={false} images={images[0]} />
        </ReactLory>

        <h3>With other components</h3>
        <ReactLory {...config}>
          <SuiMultimedia lazyLoad={false} images={images[0]} />
          <SuiMultimedia lazyLoad={false} images={images[1]} />
          <SuiMultimedia lazyLoad={false} images={images[2]} />
          <SuiMultimedia lazyLoad={false} images={images[3]} />
          <SuiMultimedia lazyLoad={false} images={images[4]} />
        </ReactLory>

        <h3>Basic example</h3>
        <ReactLory {...config}>
          <img src={images[0].src} />
          <img src={images[1].src} />
        </ReactLory>
      </div>
    }
    </div>)
  }
}

ReactDom.render(<App mounted />, document.getElementById('app'))
