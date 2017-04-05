import React, { PropTypes } from 'react'

export default function Tag ({text, inverted = false}) {
  return (
    <span className={`demo-tag ${inverted && 'inverted'}`}>{text}</span>
  )
}

Tag.propTypes = {
  text: PropTypes.string,
  inverted: PropTypes.bool
}
