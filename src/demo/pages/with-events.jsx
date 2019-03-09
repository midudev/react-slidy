import React from 'react'
import ReactSlidy from '../../../src'

import {DisplayCode} from '../utils'

export const demo = (
  <div className="text-center">
    <p>
      You can use doBeforeSlide and doAfterSlide props to execute some code on
      those important events.
    </p>
    <ReactSlidy
      doAfterSlide={({currentSlide}) => {
        document.getElementById('demo-with-events').innerHTML += `
        doAfterSlide currentSlide: ${currentSlide}<br />`
      }}
      doBeforeSlide={({currentSlide, nextSlide}) => {
        document.getElementById('demo-with-events').innerHTML += `
        doBeforeSlide currentSlide: ${currentSlide} nextSlide: ${nextSlide}<br />`
      }}
    >
      <a href="http://miduga.es">
        <img src="https://loremflickr.com/640/360" />
      </a>
      <a href="https://github.com/miduga/react-slidy">
        <img src="https://loremflickr.com/640/360" />
      </a>
    </ReactSlidy>
    <p id="demo-with-events" />
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
