import React from 'react'
import ReactSlidy from '../../../src'

import {DisplayCode} from '../utils'

export const demo = (
  <div className="text-center">
    <p>
      You can easily add links for each image by wrapping each image with the
      needed tag.
    </p>
    <ReactSlidy>
      <a href="http://miduga.es">
        <img src="https://loremflickr.com/640/360" />
      </a>
      <a href="https://github.com/miduga/react-slidy">
        <img src="https://loremflickr.com/640/360" />
      </a>
    </ReactSlidy>
    <DisplayCode>
      {`<ReactSlidy>
      <a href='http://miduga.es'>
        <img src='https://loremflickr.com/640/360' />
      </a>
      <a href='https://github.com/miduga/react-slidy'>
        <img src='https://loremflickr.com/640/360' />
      </a>
    </ReactSlidy>`}
    </DisplayCode>
  </div>
)
