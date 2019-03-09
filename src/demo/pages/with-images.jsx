import React from 'react'
import ReactSlidy from '../../../src'

import {DisplayCode} from '../utils'

export const demo = (
  <div className="text-center">
    <p>Do you want to use images 🖼️? Just put them inside!</p>
    <ReactSlidy>
      <img src="https://loremflickr.com/640/360" />
      <img src="https://loremflickr.com/641/361" />
      <img src="https://loremflickr.com/642/362" />
    </ReactSlidy>
    <DisplayCode>
      {`<ReactSlidy
        >
        <img src='https://loremflickr.com/640/360' />
        <img src='https://loremflickr.com/641/361' />
        <img src="https://loremflickr.com/642/362" />
      </ReactSlidy>
        `}
    </DisplayCode>
  </div>
)
