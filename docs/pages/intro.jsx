import React from 'react'
import ReactSlidy from '../../src'

export const demo = (
  <div className='text-center'>
    <h1 className='h1'>React Slidy</h1>
    <h4 className='h4'>a simple and minimal slider component for React</h4>
    <ReactSlidy
      enableMouseEvents
      infinite={false}
      slidesToScroll={1}>
      <img src='../img/beautiful_landscapes.jpg' />
      <img src='../img/beautiful_landscapes_02.jpg' />
    </ReactSlidy>
  </div>
)
