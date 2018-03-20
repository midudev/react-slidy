import React from 'react'
import ReactSlidy from '../../src'
import { DisplayCode } from '../utils'

import {images} from '../js/images'
console.log(images)

export const demo = (
  <div className='text-center'>
    <ReactSlidy>
      {images}
      <div>
        <p>This is the last slide and is HTML!</p>
        <button onClick={() => window.alert('yeah!')}>Oh la la!</button>
      </div>
    </ReactSlidy>
    <DisplayCode>
      {
        `<ReactSlidy>
          <img src='./img/beautiful_landscapes.jpg' />
          <img src='./img/beautiful_landscapes_02.jpg' />
          <img src='./img/beautiful_landscapes_03.jpg' />
          <img src='./img/beautiful_landscapes_04.jpg' />
          <img src='./img/beautiful_landscapes_05.jpg' />
          <div>
            <p>This is the last slide and is HTML!</p>
            <button onClick={() => window.alert('yeah!')}>Oh la la!</button>
          </div>
        </ReactSlidy>
        `
      }
    </DisplayCode>
  </div>
)
