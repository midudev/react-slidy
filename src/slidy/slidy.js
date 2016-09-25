'use strict'

import detectPrefixes from './detect-prefixes.js'
import defaults from './defaults.js'

const { slice } = Array.prototype
const prefixes = detectPrefixes()

const LINEAR_ANIMATION = 'linear'
const VALID_SWIPE_DISTANCE = 25

export function slidy (slider, opts) {
  const options = {...defaults, ...opts}

  let position
  let slidesWidth
  let frameWidth
  let slides
  let transitionEndCallback

  // DOM elements
  let frame
  let slideContainer
  let prevCtrl
  let nextCtrl

  let index = 0

  // event handling
  let touchOffset
  let currentTouchOffset
  let delta
  let isScrolling

  // clamp a number between two min and max
  function _clampNumber (x, min, max) {
    return Math.min(Math.max(x, min), max)
  }

  // get the width from a DOM element
  function _getWidthFromDOMEl (el) {
    return el.getBoundingClientRect().width
  }

  // get the coordinates from touch event
  function _getTouchCoordinatesFromEvent (event) {
    const { pageX, pageY } = event.targetTouches ? event.targetTouches[0] : event
    return { pageX: Math.round(pageX), pageY: Math.round(pageY) }
  }

  // calculate the offset with the width of the frame and the desired position
  function _getOffsetLeft (position) {
    return frameWidth * position
  }

  /**
   * private
   * _setupInfinite: function to setup if infinite is set
   *
   * @param  {array} slideArray
   * @return {array} array of updated slideContainer elements
   */
  function _setupInfinite (slideArray) {
    const { infinite } = options

    const totalSlides = slideArray.length
    const front = slideArray.slice(0, infinite)
    const back = slideArray.slice(totalSlides - infinite, totalSlides)
    const { firstChild } = slideContainer

    front.forEach(function (el) {
      const cloned = el.cloneNode(true)
      slideContainer.appendChild(cloned)
    })

    back.reverse()
      .forEach(function (el) {
        const cloned = el.cloneNode(true)
        slideContainer.insertBefore(cloned, firstChild)
      })

    return slice.call(slideContainer.children)
  }

  /**
   * translates to a given position in a given time in milliseconds
   *
   * @to        {number} number in pixels where to translate to
   * @duration  {number} time in milliseconds for the transistion
   * @ease      {string} easing css property
   */
  function _translate (to, duration, ease) {
    const easeCssText = ease ? `${prefixes.transitionTiming}: ${ease};` : ''
    const durationCssText = duration ? `${prefixes.transitionDuration}: ${duration}ms;` : ''
    const cssText = `${easeCssText}${durationCssText}
      ${prefixes.transform}: ${prefixes.translate(to)};`

    slideContainer.style.cssText = cssText
  }

  /**
   * slidefunction called by prev, next & touchend
   *
   * determine nextIndex and slide to next postion
   * under restrictions of the defined options
   *
   * @direction  {boolean}
   */
  function slide (direction) {
    const {
      slideSpeed,
      slidesToScroll,
      infinite,
      rewind,
      rewindSpeed,
      ease
    } = options

    let duration = slideSpeed

    const movement = direction ? 1 : -1
    const maxOffset = Math.round(slidesWidth - frameWidth)
    const totalSlides = slides.length

    // calculate the nextIndex according to the movement and the slidesToScroll
    let nextIndex = index + slidesToScroll * movement

    // nextIndex should be between 0 and totalSlides minus 1
    nextIndex = _clampNumber(nextIndex, 0, totalSlides - 1)

    if (infinite && direction === undefined) {
      nextIndex += infinite
    }

    let nextOffset = _clampNumber(_getOffsetLeft(nextIndex) * -1, maxOffset * -1, 0)

    if (rewind && direction && Math.abs(position) === maxOffset) {
      nextOffset = 0
      nextIndex = 0
      duration = rewindSpeed
    }

    // translate to the nextOffset by a defined duration and ease function
    _translate(nextOffset, duration, ease)

    // update the position with the next position
    position = nextOffset

    // if the nextIndex is possible according to totalSlides, then use it
    if (nextIndex <= totalSlides) {
      index = nextIndex
    }

    if (infinite && (nextIndex === totalSlides - infinite || nextIndex === 0)) {
      index = direction ? infinite : totalSlides - (infinite * 2)

      position = _getOffsetLeft(index) * -1

      transitionEndCallback = function () {
        _translate(_getOffsetLeft(index) * -1, 0)
      }
    }

    options.doAfterSlide({ currentSlide: index })
  }

  function _startTouchMouseEventsListeners () {
    const { enableMouseEvents } = options

    if (enableMouseEvents) {
      frame.addEventListener('mousemove', onTouchmove)
      frame.addEventListener('mouseup', onTouchend)
      frame.addEventListener('mouseleave', onTouchend)
    }

    frame.addEventListener('touchmove', onTouchmove)
    frame.addEventListener('touchend', onTouchend)
  }

  function _removeTouchMouseEventsListeners (all = false) {
    const {enableMouseEvents} = options

    frame.removeEventListener('touchmove', onTouchmove)
    frame.removeEventListener('touchend', onTouchend)

    if (all) {
      frame.removeEventListener('touchstart', onTouchstart)
    }

    if (enableMouseEvents) {
      frame.removeEventListener('mousemove', onTouchmove)
      frame.removeEventListener('mouseup', onTouchend)
      frame.removeEventListener('mouseleave', onTouchend)
      if (all) {
        frame.removeEventListener('mousedown', onTouchstart)
        frame.removeEventListener('click', onClick)
      }
    }
  }

  function _removeAllEventsListeners () {
    _removeTouchMouseEventsListeners(true)
    frame.removeEventListener(prefixes.transitionEnd, onTransitionEnd)
    options.window.removeEventListener('resize', onResize)

    if (prevCtrl && nextCtrl) {
      nextCtrl.removeEventListener('click', next)
      prevCtrl.removeEventListener('click', prev)
    }
  }

  function onTransitionEnd () {
    if (transitionEndCallback) {
      transitionEndCallback()
      transitionEndCallback = undefined
    }
  }

  function onTouchstart (event) {
    const { pageX, pageY } = _getTouchCoordinatesFromEvent(event)
    touchOffset = currentTouchOffset = { pageX, pageY }

    delta = {}
    isScrolling = false

    _startTouchMouseEventsListeners()
  }

  function onTouchmove (event) {
    const { pageX, pageY } = _getTouchCoordinatesFromEvent(event)

    delta = {
      x: pageX - touchOffset.pageX,
      y: pageY - touchOffset.pageY
    }

    const deltaNow = {
      x: pageX - currentTouchOffset.pageX,
      y: pageY - currentTouchOffset.pageY
    }

    currentTouchOffset = { pageX, pageY }

    const isScrollingNow = Math.abs(deltaNow.x) < Math.abs(deltaNow.y)
    isScrolling = !!(isScrolling || isScrollingNow)

    if (!isScrolling && delta.x !== 0) {
      _translate(position + delta.x, 50, LINEAR_ANIMATION)
    } else if (isScrolling) {
      onTouchend(event)
    }
  }

  function onTouchend (event) {
    /**
     * is valid if:
     * -> swipe distance is greater than the specified valid swipe distance
     * -> swipe distance is more then a third of the swipe area
     * @isValidSlide {Boolean}
     */
    const absoluteX = Math.abs(delta.x)
    const isValid = absoluteX > VALID_SWIPE_DISTANCE || absoluteX > frameWidth / 3

    /**
     * is out of bounds if:
     * -> index is 0 and delta x is greater than 0
     * -> index is the last slide and delta is smaller than 0
     * @isOutOfBounds {Boolean}
     */
    const isOutOfBounds = !index && delta.x > 0 ||
        index === slides.length - 1 && delta.x < 0

    if (isValid && !isOutOfBounds) {
      const direction = delta.x < 0
      slide(direction)
    } else {
      _translate(position, options.snapBackSpeed, LINEAR_ANIMATION)
    }

    touchOffset = {}
    isScrolling = false

    // remove eventlisteners after swipe attempt
    _removeTouchMouseEventsListeners()
  }

  function onClick (event) {
    if (delta.x) {
      event.preventDefault()
    }
  }

  function onResize (event) {
    reset()
  }

  /**
   * public
   * setup function
   */
  function _setup () {
    const {
      classNameFrame,
      classNameSlideContainer,
      classNamePrevCtrl,
      classNameNextCtrl,
      enableMouseEvents,
      infinite
    } = options

    frame = slider.getElementsByClassName(classNameFrame)[0]
    slideContainer = frame.getElementsByClassName(classNameSlideContainer)[0]
    prevCtrl = slider.getElementsByClassName(classNamePrevCtrl)[0]
    nextCtrl = slider.getElementsByClassName(classNameNextCtrl)[0]

    position = slideContainer.offsetLeft

    slides = infinite
             ? _setupInfinite(slice.call(slideContainer.children))
             : slice.call(slideContainer.children)

    reset()

    if (prevCtrl && nextCtrl) {
      prevCtrl.addEventListener('click', prev)
      nextCtrl.addEventListener('click', next)
    }

    if (enableMouseEvents) {
      frame.addEventListener('mousedown', onTouchstart)
      frame.addEventListener('click', onClick)
    }

    slideContainer.addEventListener(prefixes.transitionEnd, onTransitionEnd)
    frame.addEventListener('touchstart', onTouchstart)
    options.window.addEventListener('resize', onResize)
  }

  /**
   * public
   * reset function: called on resize
   */
  function reset () {
    const {infinite, rewindOnResize} = options
    let { ease, rewindSpeed } = options

    slidesWidth = _getWidthFromDOMEl(slideContainer)
    frameWidth = _getWidthFromDOMEl(frame)

    if (frameWidth === slidesWidth) {
      slidesWidth = slides.reduce(function (previousValue, slide) {
        return previousValue + _getWidthFromDOMEl(slide)
      }, 0)
    }

    const slidesHeight = Math.floor(slideContainer.firstChild.getBoundingClientRect().height) + 'px'
    slider.style.height = slidesHeight
    slideContainer.style.height = slidesHeight
    frame.style.height = slidesHeight

    if (rewindOnResize) {
      index = 0
    } else {
      ease = null
      rewindSpeed = 0
    }

    const offsetIndex = infinite ? index + infinite : index
    const newX = _getOffsetLeft(offsetIndex) * -1
    if (infinite) {
      _translate(newX, 0)
    } else {
      _translate(newX, rewindSpeed, ease)
    }
    index = offsetIndex
    position = newX
  }

  /**
   * public
   * returnIndex function: called on clickhandler
   */
  function returnIndex () {
    return index - options.infinite || 0
  }

  /**
   * public
   * prev function: called on clickhandler
   */
  function prev () {
    slide(false)
  }

  /**
   * public
   * next function: called on clickhandler
   */
  function next () {
    slide(true)
  }

  /**
   * public
   * destroy function: called to gracefully destroy the slidy instance
   */
  function destroy () {
    const { infinite } = options
    _removeAllEventsListeners()
    // remove cloned slides if infinite is set
    if (infinite) {
      const {firstChild, lastChild} = slideContainer
      Array.apply(null, Array(infinite)).forEach(function () {
        slideContainer.removeChild(firstChild)
        slideContainer.removeChild(lastChild)
      })
    }
  }

  // trigger initial setup
  _setup()

  // expose public api
  return {
    reset,
    slide,
    returnIndex,
    prev,
    next,
    destroy
  }
}
