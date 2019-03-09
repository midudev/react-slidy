import React, {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'

import slidy from './slidy/slidy'

function noop() {}

function getClassesName(base) {
  return {
    frame: `${base}-frame`,
    item: `${base}-item`,
    next: `${base}-next`,
    prev: `${base}-prev`,
    slides: `${base}-slides`
  }
}

function convertToArrayFrom(children) {
  return Array.isArray(children) ? children : [children]
}

export default function ReactSlidySlider(props) {
  const [slidyInstance, setSlidyInstance] = useState({
    next: noop,
    prev: noop,
    updateItems: noop
  })
  const [index, setIndex] = useState(props.initialSlide)
  const [maxIndex, setMaxIndex] = useState(props.initialSlide)
  const sliderDOMEl = useRef(null)

  const classes = getClassesName(props.classNameBase)
  let items = convertToArrayFrom(props.children)

  const destroySlider = () => {
    slidyInstance && slidyInstance.clean() && slidyInstance.destroy()
    props.doAfterDestroy()
  }

  useEffect(function() {
    const slidyInstance = slidy(sliderDOMEl.current, {
      classNameSlideContainer: classes.slides,
      ...props,
      onNext: nextIndex => {
        setIndex(nextIndex)
        nextIndex > maxIndex && setMaxIndex(nextIndex)
        return nextIndex
      },
      onPrev: nextIndex => {
        setIndex(nextIndex)
        return nextIndex
      },
      initialSlide: index,
      items: items.length,
      frameDOMEl: sliderDOMEl.current
    })
    setSlidyInstance(slidyInstance)
    return () => destroySlider()
  }, [])

  useEffect(function() {
    slidyInstance && slidyInstance.updateItems(items.length)
  })

  const renderItem = (item, index) => {
    return (
      <li className={classes.item} key={index}>
        {item}
      </li>
    )
  }

  const renderItems = () => {
    return items.slice(0, maxIndex + props.itemsToPreload).map(renderItem)
  }

  const {showArrows, tailArrowClass} = props
  const prevArrowClassName = `${classes.prev} ${
    index === 0 ? tailArrowClass : ''
  }`
  const nextArrowClassName = `${classes.next} ${
    index === items.length - 1 ? tailArrowClass : ''
  }`

  return (
    <div className={classes.frame} ref={sliderDOMEl}>
      {showArrows && (
        <span className={prevArrowClassName} onClick={slidyInstance.prev} />
      )}
      {showArrows && (
        <span className={nextArrowClassName} onClick={slidyInstance.next} />
      )}
      <ul className={classes.slides}>{renderItems()}</ul>
    </div>
  )
}

ReactSlidySlider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  classNameBase: PropTypes.string,
  dynamicContent: PropTypes.bool,
  doAfterDestroy: PropTypes.func,
  doAfterSlide: PropTypes.func,
  doBeforeSlide: PropTypes.func,
  ease: PropTypes.string,
  initialSlide: PropTypes.number,
  itemsToPreload: PropTypes.number,
  onReady: PropTypes.func,
  rewindSpeed: PropTypes.number,
  showArrows: PropTypes.bool,
  slideSpeed: PropTypes.number,
  snapBackSpeed: PropTypes.number,
  tailArrowClass: PropTypes.string
}

ReactSlidySlider.defaultProps = {
  doAfterDestroy: noop,
  doAfterSlide: noop,
  doBeforeSlide: noop,
  ease: 'ease',
  initialSlide: 0,
  itemsToPreload: 1,
  onReady: noop,
  rewindSpeed: 500,
  showArrows: true,
  slideSpeed: 500,
  snapBackSpeed: 500
}
