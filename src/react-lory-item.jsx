import React, { PropTypes } from 'react'

export default function ReactLoryItem ({className, item}) {
  return <li className={className}>{item}</li>
}

ReactLoryItem.propTypes = {
  className: PropTypes.string,
  item: PropTypes.node
}
