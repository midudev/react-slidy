import detectPrefixes from './detect-prefixes.js'

const { slice } = Array.prototype
const prefixes = detectPrefixes()

const LINEAR_ANIMATION = 'linear'
const SLIDES_TO_SCROLL = 1
const VALID_SWIPE_DISTANCE = 25

export function slidy (slider, options) {
  const {
    aspectRatio,
    ease,
    infinite,
    items,
    rewind,
    rewindSpeed,
    slideSpeed
  } = options

  const {abs, floor, min, max, round} = Math
  const {frameDOMEl} = options
  const windowDOM = window
  // DOM elements
  const slideContainerDOMEl = frameDOMEl.getElementsByClassName(options.classNameSlideContainer)[0]
  // initialize some variables
  let frameWidth = 0
  let index = 0
  let loadedIndex = { 0: 1, 1: 1 }
  let maxOffset = 0
  let position = 0
  let slides = []
  let transitionEndCallback

  // event handling
  let touchOffset = { pageX: 0, pageY: 0 }
  let currentTouchOffset = { pageX: 0, pageY: 0 }
  let delta = { x: 0, y: 0 }
  let isScrolling = false

  // clamp a number between two min and max values
  function _clampNumber (x, minValue, maxValue) {
    return min(max(x, minValue), maxValue)
  }

  // get the width from a DOM element
  function _getWidthFromDOMEl (el) {
    return el.getBoundingClientRect().width
  }

  // calculate the offset with the width of the frame and the desired position
  function _getOffsetLeft (slidePosition) {
    return frameWidth * slidePosition
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
    const { firstChild } = slideContainerDOMEl

    front.forEach(function (el) {
      const cloned = el.cloneNode(true)
      slideContainerDOMEl.appendChild(cloned)
    })

    back.reverse()
      .forEach(function (el) {
        const cloned = el.cloneNode(true)
        slideContainerDOMEl.insertBefore(cloned, firstChild)
      })

    return slice.call(slideContainerDOMEl.children)
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

    slideContainerDOMEl.style.cssText = cssText
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
    let duration = slideSpeed

    const movement = direction ? 1 : -1
    const totalSlides = slides.length

    // calculate the nextIndex according to the movement
    let nextIndex = index + SLIDES_TO_SCROLL * movement

    // nextIndex should be between 0 and totalSlides minus 1
    nextIndex = _clampNumber(nextIndex, 0, totalSlides - 1)

    if (infinite && direction === undefined) {
      nextIndex += infinite
    }

    let nextOffset = _clampNumber(_getOffsetLeft(nextIndex) * -1, maxOffset * -1, 0)

    if (rewind && direction && abs(position) === maxOffset) {
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
    } else {
      const indexToLoad = index + SLIDES_TO_SCROLL * movement
      const indexLoaded = !!loadedIndex[indexToLoad]
      if (indexToLoad < totalSlides && indexToLoad >= 0 && !indexLoaded) {
        // insert in the correct position
        slideContainerDOMEl.appendChild(slides[indexToLoad])
        loadedIndex[indexToLoad] = 1
      }
    }

    options.doAfterSlide({ currentSlide: index })
  }

  function _removeTouchEventsListeners (all = false) {
    frameDOMEl.removeEventListener('touchmove', onTouchmove)
    frameDOMEl.removeEventListener('touchend', onTouchend)
    if (all) {
      frameDOMEl.removeEventListener('touchstart', onTouchstart)
    }
  }

  function _removeAllEventsListeners () {
    _removeTouchEventsListeners(true)
    frameDOMEl.removeEventListener(prefixes.transitionEnd, onTransitionEnd)
    windowDOM.removeEventListener('resize', onResize)
  }

  function onTransitionEnd () {
    if (transitionEndCallback) {
      transitionEndCallback()
      transitionEndCallback = undefined
    }
  }

  function onTouchstart (event) {
    const { pageX, pageY } = event.targetTouches ? event.targetTouches[0] : event
    touchOffset = currentTouchOffset = { pageX, pageY }
    frameDOMEl.addEventListener('touchmove', onTouchmove)
    frameDOMEl.addEventListener('touchend', onTouchend)
  }

  function onTouchmove (event) {
    const { pageX, pageY } = event.targetTouches ? event.targetTouches[0] : event

    delta = {
      x: pageX - touchOffset.pageX,
      y: pageY - touchOffset.pageY
    }

    const deltaNow = {
      x: pageX - currentTouchOffset.pageX,
      y: pageY - currentTouchOffset.pageY
    }

    currentTouchOffset = { pageX, pageY }

    const isScrollingNow = abs(deltaNow.x) < abs(deltaNow.y)
    isScrolling = !!(isScrolling || isScrollingNow)

    if (!isScrolling && delta.x !== 0) {
      _translate(Math.round(position + delta.x), 0)
    } else if (isScrolling) {
      event.preventDefault()
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
    const absoluteX = abs(delta.x)
    const isValid = absoluteX > VALID_SWIPE_DISTANCE || absoluteX > frameWidth / 3

    /**
     * is out of bounds if:
     * -> index is 0 and delta x is greater than 0
     * -> index is the last slide and delta is smaller than 0
     * @isOutOfBounds {Boolean}
     */
    const direction = delta.x < 0
    const isOutOfBounds = !index && !direction ||
        index === slides.length - 1 && direction

    if (isValid && !isOutOfBounds) {
      slide(direction)
    } else {
      _translate(position, options.snapBackSpeed, LINEAR_ANIMATION)
    }

    delta = {}
    touchOffset = {}
    isScrolling = false

    _removeTouchEventsListeners()
  }

  function _convertItemToDOM (string) {
    return document
            .createRange()
            .createContextualFragment(`<li class='${options.classNameItem}'>${string}</li>`)
  }

  function onResize (event) {
    reset()
  }

  /**
   * public
   * setup function
   */
  function _setup () {
    const { infinite } = options
    const slidesArray = slice.call(items.map(i => _convertItemToDOM(i)))
    position = slideContainerDOMEl.offsetLeft

    slides = infinite ? _setupInfinite(slidesArray) : slice.call(slidesArray)

    reset()

    slideContainerDOMEl.addEventListener(prefixes.transitionEnd, onTransitionEnd)
    frameDOMEl.addEventListener('touchstart', onTouchstart)
    windowDOM.addEventListener('resize', onResize)
  }

  /**
   * public
   * reset function: called on resize
   */
  function reset () {
    const {infinite, rewindOnResize} = options
    let { ease, rewindSpeed } = options

    frameWidth = _getWidthFromDOMEl(frameDOMEl)
    maxOffset = round(frameWidth * slides.length - frameWidth)

    let slidesHeight = aspectRatio
                       ? aspectRatio * frameWidth
                       : floor(slideContainerDOMEl.firstChild.getBoundingClientRect().height) + 'px'

    slideContainerDOMEl.style.height = slidesHeight
    frameDOMEl.style.height = slidesHeight

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
      const {firstChild, lastChild} = slideContainerDOMEl
      Array.apply(null, Array(infinite)).forEach(function () {
        slideContainerDOMEl.removeChild(firstChild)
        slideContainerDOMEl.removeChild(lastChild)
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
