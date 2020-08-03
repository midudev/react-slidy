import React, {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import ReactSlidySlider from './react-slidy-slider'

function noop() {}

const CLASSNAMES = {
  contain: 'react-Slidy--contain',
  cover: 'react-Slidy--cover',
  fullHeight: 'react-Slidy--fullHeight',
  fullWidth: 'react-Slidy--fullWidth'
}

const ReactSlidy = ({
  ArrowLeft,
  ArrowRight,
  children,
  classNameBase = 'react-Slidy',
  doAfterDestroy = noop,
  doAfterInit = noop,
  doAfterSlide = noop,
  doBeforeSlide = noop,
  imageObjectFit,
  itemsToPreload = 1,
  initialSlide = 0,
  ease = 'ease',
  lazyLoadSlider = true,
  lazyLoadConfig = {
    offset: 150
  },
  keyboardNavigation = false,
  numOfSlides = 1,
  sanitize = true,
  slide = 0,
  slideSpeed = 500,
  showArrows = true,
  useFullHeight = false,
  useFullWidth = true
}) => {
  const [showSlider, setShowSlider] = useState(!lazyLoadSlider)
  const nodeEl = useRef(null)

  useEffect(
    function() {
      let observer

      if (lazyLoadSlider) {
        const initLazyLoadSlider = () => {
          // if we support IntersectionObserver, let's use it
          const {offset = 0} = lazyLoadConfig
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

  const numOfSlidesSanitzed = Math.min(
    numOfSlides,
    React.Children.count(children)
  )

  const rootClassName = [
    classNameBase,
    useFullHeight && CLASSNAMES.fullHeight,
    useFullWidth && CLASSNAMES.fullWidth,
    imageObjectFit && CLASSNAMES[imageObjectFit]
  ]
    .filter(Boolean)
    .join(' ')

  const reactSlidySliderProps = {
    ArrowLeft,
    ArrowRight,
    children,
    classNameBase,
    doAfterDestroy,
    doAfterInit,
    doAfterSlide,
    doBeforeSlide,
    ease,
    initialSlide,
    itemsToPreload,
    keyboardNavigation,
    numOfSlides,
    slide,
    showArrows,
    slideSpeed
  }

  return (
    <div className={rootClassName} ref={nodeEl}>
      {showSlider && (
        <ReactSlidySlider
          {...reactSlidySliderProps}
          numOfSlides={sanitize ? numOfSlidesSanitzed : numOfSlides}
        >
          {children}
        </ReactSlidySlider>
      )}
    </div>
  )
}

ReactSlidy.propTypes = {
  /** Component to be used as the left arrow for the slider */
  ArrowLeft: PropTypes.elementType,
  /** Component to be used as the right arrow for the slider */
  ArrowRight: PropTypes.elementType,
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
  /** Determine the object-fit property for the images */
  imageObjectFit: PropTypes.oneOf(['cover', 'contains']),
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
  /** Number of slides to show at once */
  numOfSlides: PropTypes.number,
  /** Determine if we want to sanitize the slides or take numberOfSlider directly */
  sanitize: PropTypes.bool,
  /** Change dynamically the slide number, perfect to use with dots */
  slide: PropTypes.number,
  /** Determine if arrows should be shown */
  showArrows: PropTypes.bool,
  /** Determine the speed of the sliding animation */
  slideSpeed: PropTypes.number,
  /** Use the full width of the container for the image */
  useFullWidth: PropTypes.bool,
  /** Use the full height of the container adding some styles to the elements */
  useFullHeight: PropTypes.bool
}

export default ReactSlidy
