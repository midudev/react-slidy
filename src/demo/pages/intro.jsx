import React from 'react'
import ReactSlidy from '../../../src'
import {DisplayCode} from '../utils'

const Number = ({num}) => { // eslint-disable-line
  return (
    <span
      style={{
        color: '#888',
        height: '250px',
        fontSize: '100px',
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        textShadow: '2px 2px 0px #aaa',
        width: '100%'
      }}
    >
      {num}
    </span>
  )
}

export const demo = (
  <div className="text-center">
    <h1 className="h1 mb0 mt0">React Slidy</h1>
    <h4 className="h4">a simple and minimal slider component for React</h4>
    <p>
      Just wrap the slides that you want to use on your slider. React Slidy will
      do the magic for you
    </p>
    <ReactSlidy>
      <Number num={1} />
      <Number num={2} />
      <Number num={3} />
      <Number num={4} />
    </ReactSlidy>
    <DisplayCode>
      {`<ReactSlidy>
      <Number num={1} />
      <Number num={2} />
      <Number num={3} />
      <Number num={4} />
    </ReactSlidy>`}
    </DisplayCode>
  </div>
)
