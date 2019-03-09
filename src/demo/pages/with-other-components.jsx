import React from 'react'
import ReactSlidy from '../../../src'

import {DisplayCode} from '../utils'

const Number = ({num}) => { // eslint-disable-line
  return (
    <span
      style={{
        color: '#555',
        height: '250px',
        fontSize: '75px',
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      {num}
    </span>
  )
}

export const demo = (
  <div className="text-center">
    <h4 className="h4">you can use it with other components</h4>
    <ReactSlidy>
      {[0, 1, 2, 3].map(num => <Number key={num} num={num} />)}
    </ReactSlidy>
    <DisplayCode>
      {`<ReactSlidy
        
      >
        {images.map((img, key) => (
          <Multimedia key={key} lazyLoad={false} {...img} />
        ))}
      </ReactSlidy>`}
    </DisplayCode>
  </div>
)
