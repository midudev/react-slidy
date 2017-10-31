import React from 'react'
import ReactSlidy from '../../src'

import { DisplayCode } from '../utils'

export const demo = (
  <div className='text-center'>
    <p>You can initialize the slider with any index.</p>
    <ReactSlidy initialSlide={1}>
      <a href='http://miduga.es'>
        <img src='../img/beautiful_landscapes.jpg' />
      </a>
      <a href='https://github.com/miduga/react-slidy'>
        <img src='../img/beautiful_landscapes_02.jpg' />
      </a>
      <a href='https://github.com/miduga/react-slidy'>
        <img src='../img/beautiful_landscapes_03.jpg' />
      </a>
    </ReactSlidy>
    <p id='demo-with-initial-index' />
    <DisplayCode>
      {`<ReactSlidy initialSlide={1}>
      <a href='http://miduga.es'>
        <img src='../img/beautiful_landscapes.jpg' />
      </a>
      <a href='https://github.com/miduga/react-slidy'>
        <img src='../img/beautiful_landscapes_02.jpg' />
      </a>
    </ReactSlidy>`
      }
    </DisplayCode>
  </div>
)
