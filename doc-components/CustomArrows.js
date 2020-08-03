/* eslint-disable react/prop-types */
import React from 'react'

const buttonStyle = {
  background: 'transparent',
  border: 0,
  cursor: 'pointer',
  fontSize: 72,
  height: '30%',
  margin: 'auto 10px',
  padding: 15
}

function CustomArrow({emoji, ...props}) {
  return (
    <button {...props} style={buttonStyle}>
      <span role="img" aria-label="Arrow">
        {emoji}
      </span>
    </button>
  )
}

export function CustomArrowLeft(props) {
  return <CustomArrow {...props} emoji="👈" />
}

export function CustomArrowRight(props) {
  return <CustomArrow {...props} emoji="👉" />
}
