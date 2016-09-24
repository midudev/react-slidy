'use strict'

import detectPrefixes from './utils/detect-prefixes.js'
import defaults from './defaults.js'

const { slice } = Array.prototype

const TOUCH_DURATION = 300

export function lory (slider, opts) {
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
  let prefixes

  let index = 0
  let options = {}

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
    const cssText = `${easeCssText}
      ${prefixes.transitionDuration}: ${duration}ms;
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
  function slide (nextIndex, direction) {
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

    // if it's not a number, then is used for prev and next
    if (typeof nextIndex !== 'number') {
      nextIndex = index + slidesToScroll * movement
    }

    // nextIndex should be  between 0 and total slides minus 1
    nextIndex = Math.min(Math.max(nextIndex, 0), totalSlides - 1)

    if (infinite && direction === undefined) {
      nextIndex += infinite
    }

    let nextOffset = Math.min(Math.max(_getOffsetLeft(nextIndex) * -1, maxOffset * -1), 0)

    if (rewind && direction && Math.abs(position.x) === maxOffset) {
      nextOffset = 0
      nextIndex = 0
      duration = rewindSpeed
    }

    // translate to the nextOffset by a defined duration and ease function
    _translate(nextOffset, duration, ease)

    // update the position with the next position
    position.x = nextOffset

    // if we offset of the next index is inside the maxOffset then use nextIndex
    if (_getOffsetLeft(nextIndex) <= maxOffset) {
      index = nextIndex
    }

    if (infinite && (nextIndex === totalSlides - infinite || nextIndex === 0)) {
      index = direction ? infinite : totalSlides - (infinite * 2)

      position.x = _getOffsetLeft(index) * -1

      transitionEndCallback = function () {
        _translate(_getOffsetLeft(index) * -1, 0, undefined)
      }
    } else {
      transitionEndCallback = function () {
        options.doAfterSlide({ currentSlide: index })
      }
    }
  }

  /**
   * public
   * setup function
   */
  function setup () {
    prefixes = detectPrefixes()

    options = {...defaults, ...opts}

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

    position = {
      x: slideContainer.offsetLeft,
      y: slideContainer.offsetTop
    }

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

  function _getWidthFromDOMEl (el) {
    return el.getBoundingClientRect().width
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
      _translate(newX, 0, null)
    } else {
      _translate(newX, rewindSpeed, ease)
    }
    index = offsetIndex
    position.x = newX
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
    slide(false, false)
  }

  /**
   * public
   * next function: called on clickhandler
   */
  function next () {
    slide(false, true)
  }

  function removeTouchMouseEventsListeners (all = false) {
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

  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   */
  function destroy () {
    const {infinite, window} = options
    // remove event listeners
    removeTouchMouseEventsListeners(true)
    frame.removeEventListener(prefixes.transitionEnd, onTransitionEnd)

    window.removeEventListener('resize', onResize)

    if (prevCtrl && nextCtrl) {
      nextCtrl.removeEventListener('click', next)
      prevCtrl.removeEventListener('click', prev)
    }

    // remove cloned slides if infinite is set
    if (infinite) {
      const {firstChild, lastChild} = slideContainer
      Array.apply(null, Array(infinite)).forEach(function () {
        slideContainer.removeChild(firstChild)
        slideContainer.removeChild(lastChild)
      })
    }
  }

  // event handling
  let touchOffset
  let delta
  let isScrolling

  function onTransitionEnd () {
    if (transitionEndCallback) {
      transitionEndCallback()
      transitionEndCallback = undefined
    }
  }

  function _getCoordinatesFromEvent (event) {
    return event.touches ? event.touches[0] : event
  }

  function onTouchstart (event) {
    const { pageX, pageY } = _getCoordinatesFromEvent(event)
    const { enableMouseEvents } = options

    if (enableMouseEvents) {
      frame.addEventListener('mousemove', onTouchmove)
      frame.addEventListener('mouseup', onTouchend)
      frame.addEventListener('mouseleave', onTouchend)
    }

    frame.addEventListener('touchmove', onTouchmove)
    frame.addEventListener('touchend', onTouchend)

    touchOffset = {
      x: pageX,
      y: pageY,
      time: Date.now()
    }

    delta = {}
  }

  function onTouchmove (event) {
    const { pageX, pageY } = _getCoordinatesFromEvent(event)

    delta = {
      x: pageX - touchOffset.x,
      y: pageY - touchOffset.y
    }

    // const isScrollingNow = Math.abs(delta.x) < Math.abs(delta.y)
    _translate(position.x + delta.x, 0, null)
  }

  function onTouchend (event) {
    // time between touchstart and touchend in milliseconds
    const duration = touchOffset ? Date.now() - touchOffset.time : TOUCH_DURATION

    /**
     * is valid if:
     *
     * -> swipe attempt time is over 300 ms
     * and
     * -> swipe distance is greater than 25px
     * or
     * -> swipe distance is more then a third of the swipe area
     *
     * @isValidSlide {Boolean}
     */
    const absoluteX = Math.abs(delta.x)
    const isValid = duration < TOUCH_DURATION &&
        absoluteX > 25 ||
        absoluteX > frameWidth / 3

    /**
     * is out of bounds if:
     * -> index is 0 and delta x is greater than 0
     * or
     * -> index is the last slide and delta is smaller than 0
     * @isOutOfBounds {Boolean}
     */
    const isOutOfBounds = !index && delta.x > 0 ||
        index === slides.length - 1 && delta.x < 0

    if (!isScrolling) {
      if (isValid && !isOutOfBounds) {
        const direction = delta.x < 0
        slide(false, direction)
      } else {
        _translate(position.x, options.snapBackSpeed)
      }
    }

    touchOffset = {}

    // remove eventlisteners after swipe attempt
    removeTouchMouseEventsListeners()
  }

  function onClick (event) {
    if (delta.x) {
      event.preventDefault()
    }
  }

  function onResize (event) {
    reset()
  }

  // trigger initial setup
  setup()

  // expose public api
  return {
    setup,
    reset,
    slide,
    returnIndex,
    prev,
    next,
    destroy
  }
}
