/* eslint-disable react/prop-types */
import React from 'react'

const wrapperStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  zIndex: 1,
  alignItems: 'center',
  display: 'flex',
  width: 'auto'
}

const buttonStyle = {
  cursor: 'pointer',
  border: 0,
  background: 'transparent',
  fontSize: 72,
  padding: 15,
  margin: 10
}

export default function CustomArrowLeft({onClick}) {
  return (
    <div style={wrapperStyle}>
      <button onClick={onClick} style={buttonStyle}>
        <span role="img" aria-label="Left">
          👈
        </span>
      </button>
    </div>
  )
}
