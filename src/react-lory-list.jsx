import React, { PropTypes } from 'react'

import ReactLoryItem from './react-lory-item'

export default function ReactLoryList ({className, classNameItem, items}) {
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <ReactLoryItem
          className={classNameItem}
          item={item}
          key={index} />))}</ul>
  )
}

ReactLoryList.propTypes = {
  className: PropTypes.string,
  classNameItem: PropTypes.string,
  items: PropTypes.array
}
