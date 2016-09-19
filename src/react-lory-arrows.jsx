import React, { PropTypes } from 'react'

export default function ReactLoryArrows ({showArrows, className, classNamePrev, classNameNext}) {
  return !showArrows
    ? <noscript />
    : (
    <div className={className}>
      <span className={classNamePrev} />
      <span className={classNameNext} />
    </div>)
}

ReactLoryArrows.propTypes = {
  className: PropTypes.string,
  classNamePrev: PropTypes.string,
  classNameNext: PropTypes.string,
  showArrows: PropTypes.bool
}
