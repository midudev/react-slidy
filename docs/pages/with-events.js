import React from 'react'
import ReactSlidy from '../../dist/react-slidy'

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
      infinite={false}
    >
      <a href="https://midudev.com">
        <img src={require('../img/beautiful_landscapes.jpg')} />
      </a>
      <a href="https://midudev.com">
        <img src={require('../img/beautiful_landscapes_02.jpg')} />
      </a>
      <a href="https://midudev.com">
        <img src={require('../img/beautiful_landscapes_03.jpg')} />
      </a>
    </ReactSlidy>
    <p id="demo-with-events" />
    <DisplayCode>
      {`<ReactSlidy
      infinite={false}>
      <a href='http://miduga.es'>
        <img src='./img/beautiful_landscapes.jpg' />
      </a>
      <a href='https://github.com/miduga/react-slidy'>
        <img src='./img/beautiful_landscapes_02.jpg' />
      </a>
    </ReactSlidy>`}
    </DisplayCode>
  </div>
)
