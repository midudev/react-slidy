import React from 'react'

export default ({num}) => { // eslint-disable-line
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
