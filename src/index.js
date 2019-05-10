import React, {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import ReactSlidySlider from './react-slidy-slider'

function noop() {}

const ReactSlidy = props => {
  const [showSlider, setShowSlider] = useState(!props.lazyLoadSlider)
  const nodeEl = useRef(null)

  useEffect(
    function() {
      let observer

      if (props.lazyLoadSlider) {
        const initLazyLoadSlider = () => {
          // if we support IntersectionObserver, let's use it
          const {offset = 0} = props.lazyLoadConfig
          observer = new window.IntersectionObserver(handleIntersection, {
            rootMargin: `${offset}px 0px 0px`
          })
          observer.observe(nodeEl.current)
        }

        if (!('IntersectionObserver' in window)) {
          import('intersection-observer').then(initLazyLoadSlider)
        } else {
          initLazyLoadSlider()
        }
      }

      return () => observer && observer.disconnect()
    },
    [] // eslint-disable-line
  )

  const handleIntersection = ([entry], observer) => {
    if (entry.isIntersecting || entry.intersectionRatio > 0) {
      observer.unobserve(entry.target)
      setShowSlider(true)
    }
  }

  return (
    <div className={props.classNameBase} ref={nodeEl}>
      {showSlider && (
        <ReactSlidySlider parentRef={nodeEl} {...props}>
          {props.children}
        </ReactSlidySlider>
      )}
    </div>
  )
}

ReactSlidy.propTypes = {
  /** Children to be used as slides for the slider */
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  /** Class base to create all clases for elements. Styles might break if you modify it. */
  classNameBase: PropTypes.string,
  /** Function that will be executed AFTER destroying the slider. Useful for clean up stuff */
  doAfterDestroy: PropTypes.func,
  /** Function that will be executed AFTER initializing  the slider */
  doAfterInit: PropTypes.func,
  /** Function that will be executed AFTER slide transition has ended */
  doAfterSlide: PropTypes.func,
  /** Function that will be executed BEFORE slide is happening */
  doBeforeSlide: PropTypes.func,
  /** Ease mode to use on translations */
  ease: PropTypes.string,
  /** Determine the number of items that will be preloaded */
  itemsToPreload: PropTypes.number,
  /** Determine the first slide to start with */
  initialSlide: PropTypes.number,
  /** Activate navigation by keyboard */
  keyboardNavigation: PropTypes.bool,
  /** Determine if the slider will be lazy loaded using Intersection Observer */
  lazyLoadSlider: PropTypes.bool,
  /** Configuration for lazy loading. Only needed if lazyLoadSlider is true */
  lazyLoadConfig: PropTypes.shape({
    /** Distance which the slider will be loaded */
    offset: PropTypes.number
  }),
  /** Determine if arrows should be shown */
  showArrows: PropTypes.bool,
  /** Determine the speed of the sliding animation */
  slideSpeed: PropTypes.number,
  /** Configure arrow class for determin that arrow is the last one */
  tailArrowClass: PropTypes.string
}

ReactSlidy.defaultProps = {
  classNameBase: 'react-Slidy',
  doAfterDestroy: noop,
  doAfterInit: noop,
  doAfterSlide: noop,
  doBeforeSlide: noop,
  itemsToPreload: 1,
  initialSlide: 0,
  ease: 'ease',
  lazyLoadSlider: true,
  lazyLoadConfig: {
    offset: 150
  },
  navigateByKeyboard: false,
  slideSpeed: 500,
  showArrows: true,
  tailArrowClass: 'react-Slidy-arrow--disabled'
}

export default ReactSlidy
