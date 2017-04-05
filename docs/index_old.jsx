/* eslint-disable react/no-multi-comp */

import React, {Component, PropTypes} from 'react'
import ReactDom from 'react-dom'
import ReactSlidy from '../src'
import { DisplayCode } from './utils'

import SuiMultimedia from '@schibstedspain/sui-multimedia'

import './index.scss'

const images = [{
  src: 'https://scontent-mad1-1.cdninstagram.com/t51.2885-15/e15/11189686_499366993548088_1592806536_n.jpg',
  alt: 'Bicing Old town Barcelona'
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
  src: 'https://instagram.fmad3-1.fna.fbcdn.net/t51.2885-15/e35/14279139_1165353656857042_1035970169_n.jpg?ig_cache_key=MTM0MjY0Mzg5NDg0NDQxMDYyNA%3D%3D.2',
  alt: 'Tokyo'
}, {
  src: 'https://instagram.fmad3-1.fna.fbcdn.net/t51.2885-15/e35/14295422_1145460988876046_1900069445_n.jpg?ig_cache_key=MTM0MjY0MzUzNzQ4MTAyNTA5Ng%3D%3D.2',
  alt: 'Mall'
}, {
  src: 'https://instagram.fmad3-1.fna.fbcdn.net/t51.2885-15/s480x480/e35/14280638_887699054694002_1554320480_n.jpg?ig_cache_key=MTM0MjY0MzE4MzkxNzkyMjUzNA%3D%3D.2',
  alt: 'Tower'
}]

const handlers = {
  doAfterSlide: ({currentSlide}) => {},
  doAfterDestroy: ({event}) => window.console.info(event)
}

const config = {
  slidesToScroll: 1,
  infinite: false,
  ...handlers
}

const configWithCustomLazyLoad = {
  ...config,
  lazyLoadConfig: {
    offsetVertical: 0,
    debounce: false
  }
}

const BasicExample = (
  <ReactSlidy {...config}>
    <img {...images[0]} />
    <img {...images[1]} />
  </ReactSlidy>
)

class App extends Component {
  constructor (...args) {
    super(...args)
    this.state = { mounted: this.props.mounted, currentSlide: 0 }
  }

  componentWillReceiveProps ({mounted}) {
    /* we're using mounted state in order to change this prop with React Dev Tools
      and check that componentWillUnmount is executed as expected */
    this.setState({mounted})
  }

  render () {
    return (
      <div>
        <div className='text-center'>
          <h1 className='verybig'>React Slidy</h1>
          <h4 className='normal'>a simple and minimal slider component for React</h4>
        </div>
        {this.state.mounted &&
          <div>
            <h3 className='big mv'>With other components</h3>
            <ReactSlidy {...config}>
              {images.map((img, key) => <SuiMultimedia key={key} lazyLoad={false} images={img} />)}
            </ReactSlidy>

            <h3 className='big mv'>Only one image</h3>
            <ReactSlidy {...config} lazyLoadSlider={false}>
              <SuiMultimedia lazyLoad={false} images={images[0]} />
            </ReactSlidy>

            <DisplayCode
              heading='Basic example'
              code={`
<ReactSlidy {...config}>
  <img {...images[0]} />
  <img {...images[1]} />
</ReactSlidy>`}
              prettify
            />

            {BasicExample}

            <h3 className='big mv'>LazyLoad config example</h3>
            <ReactSlidy {...config}>
              <img {...images[0]} />
              <img {...images[1]} />
            </ReactSlidy>
            <ReactSlidy {...configWithCustomLazyLoad}>
              <img {...images[2]} />
              <img {...images[1]} />
            </ReactSlidy>
          </div>
      }
      </div>
    )
  }
}

App.propTypes = {
  mounted: PropTypes.bool
}

ReactDom.render(<App mounted />, document.getElementById('app'))
