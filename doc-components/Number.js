import React from 'react'

const style = {
  alignContent: 'center',
  alignItems: 'center',
  backgroundColor: '#eee',
  color: '#888',
  display: 'flex',
  fontSize: '100px',
  height: '250px',
  justifyContent: 'center',
  textShadow: '2px 2px 0px #aaa',
  width: '100%'
}

export default ({num}) => { // eslint-disable-line
  return <span style={style}>{num}</span>
}
