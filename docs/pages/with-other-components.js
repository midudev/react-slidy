import React from 'react'
import ReactSlidy from '../../src'

import { DisplayCode } from '../utils'

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
}]

const ImageComponent = ({ src }) => (
  <div className='ImageComponent'>
    <img src={src} />
  </div>
)

export const demo = (
  <div className='text-center'>
    <h4 className='h4'>you can use it with other components</h4>
    <ReactSlidy
      infinite={false}
    >
      {images.map((img, key) => <ImageComponent key={key} {...img} />)}
    </ReactSlidy>
    <DisplayCode>
      {`<ReactSlidy
        infinite={false}
      >
        {images.map((img, key) => <SuiMultimedia key={key} lazyLoad={false} images={img} />)}
      </ReactSlidy>`
      }
    </DisplayCode>
  </div>
)
