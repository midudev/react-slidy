'use strict'

import detectPrefixes from './utils/detect-prefixes.js'
import dispatchEvent from './utils/dispatch-event.js'
import defaults from './defaults.js'

const { slice } = Array.prototype
const requestFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

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

    slideContainer.addEventListener(prefixes.transitionEnd, onTransitionEnd)

    return slice.call(slideContainer.children)
  }

  /**
   * [dispatchSliderEvent description]
   * @return {[type]} [description]
   */
  function _dispatchSliderEvent (phase, type, detail) {
    dispatchEvent(slider, `${phase}.lory.${type}`, detail)
  }

  /**
   * translates to a given position in a given time in milliseconds
   *
   * @to        {number} number in pixels where to translate to
   * @duration  {number} time in milliseconds for the transistion
   * @ease      {string} easing css property
   */
  function _translate (to, duration, ease) {
    const easeCssText = ease ? `${prefixes.transitionTiming}: ${ease}` : ''
    const cssText = `
      ${easeCssText}
      ${prefixes.transitionDuration}: ${duration}ms
      ${prefixes.transform}: ${prefixes.translate(to)}`
    requestFrame(function () {
      slideContainer.style.cssText = cssText
    })
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
    const nextSlide = index * movement
    const maxOffset = Math.round(slidesWidth - frameWidth)

    _dispatchSliderEvent('before', 'slide', { index, nextSlide })

    // if it's not a number, then is used for prev and next
    if (typeof nextIndex !== 'number') {
      nextIndex = index + slidesToScroll * movement
    }

    nextIndex = Math.min(Math.max(nextIndex, 0), slides.length - 1)

    if (infinite && direction === undefined) {
      nextIndex += infinite
    }

    let nextOffset = Math.min(Math.max(_getOffsetLeft(nextIndex) * -1, maxOffset * -1), 0)

    if (rewind && Math.abs(position.x) === maxOffset && direction) {
      nextOffset = 0
      nextIndex = 0
      duration = rewindSpeed
    }

    // translate to the nextOffset by a defined duration and ease function
    _translate(nextOffset, duration, ease)

    // update the position with the next position
    position.x = nextOffset

    /**
     * TODO
     * update the index with the nextIndex only if
     * the offset of the nextIndex is in the range of the maxOffset
     */
    if (_getOffsetLeft(nextIndex) <= maxOffset) {
      index = nextIndex
    }

    if (infinite && (nextIndex === slides.length - infinite || nextIndex === 0)) {
      index = direction ? infinite : slides.length - (infinite * 2)

      position.x = _getOffsetLeft(index) * -1

      transitionEndCallback = function () {
        _translate(_getOffsetLeft(index) * -1, 0, undefined)
      }
    }

    _dispatchSliderEvent('after', 'slide', { currentSlide: index })
  }

  /**
   * public
   * setup function
   */
  function setup () {
    _dispatchSliderEvent('before', 'init')

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

    frame.addEventListener('touchstart', onTouchstart)
    options.window.addEventListener('resize', onResize)

    _dispatchSliderEvent('after', 'init')
  }

  function _getWidthFromDOMEl (el) {
    return el.getBoundingClientRect().width || el.offsetWidth
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

    if (rewindOnResize) {
      index = 0
    } else {
      ease = null
      rewindSpeed = 0
    }

    if (infinite) {
      const newX = _getOffsetLeft(index + infinite) * -1
      _translate(newX, 0, null)
      index = index + infinite
      position.x = newX
    } else {
      const newX = _getOffsetLeft(index) * -1
      _translate(newX, rewindSpeed, ease)
      position.x = newX
    }
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
    _dispatchSliderEvent('before', 'destroy')
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

    _dispatchSliderEvent('after', 'destroy')
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

  function onTouchstart (event) {
    const {enableMouseEvents} = options
    const touches = event.touches ? event.touches[0] : event
    const {pageX, pageY} = touches

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

    isScrolling = false
    translating = false

    delta = {}
  }

  var translating = false

  function onTouchmove (event) {
    const touches = event.touches ? event.touches[0] : event
    const {pageX, pageY} = touches

    delta = {
      x: pageX - touchOffset.x,
      y: pageY - touchOffset.y
    }

    const isScrollingNow = Math.abs(delta.x) < Math.abs(delta.y)

    if (!isScrolling & !isScrollingNow) {
      _translate(position.x + delta.x, 0, null)
      event.preventDefault()
      event.stopPropagation()
      translating = true
      return false
    }

    if (isScrollingNow && translating) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
  }

  function onTouchend (event) {
    translating = false
    /**
     * time between touchstart and touchend in milliseconds
     * @duration {number}
     */
    const duration = touchOffset ? Date.now() - touchOffset.time : 300

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
    const isValid = duration < 300 &&
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

    const direction = delta.x < 0

    if (!isScrolling) {
      if (isValid && !isOutOfBounds) {
        slide(false, direction)
      } else {
        _translate(position.x, options.snapBackSpeed)
      }
    }

    touchOffset = undefined

    /**
     * remove eventlisteners after swipe attempt
     */
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
