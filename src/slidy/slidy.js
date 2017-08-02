// @flow
import detectPrefixes from './detect-prefixes'

const { slice } = Array.prototype
const prefixes = detectPrefixes()

const LINEAR_ANIMATION = 'linear'
const SLIDES_TO_SCROLL = 1
const VALID_SWIPE_DISTANCE = 25
const {abs, min, max, round} = Math

type Coordinates = {
  pageX: number,
  pageY: number
}

type Options = {
  classNameItem: string,
  classNameNextCtrl: string,
  classNamePrevCtrl: string,
  classNameSlideContainer: string,
  doAfterSlide: Function,
  doBeforeSlide: Function,
  ease: string,
  frameDOMEl: HTMLElement,
  infinite: boolean,
  items: any,
  itemsPreloaded: any,
  rewind: boolean,
  rewindOnResize: boolean,
  rewindSpeed: any,
  slideSpeed: any,
  snapBackSpeed: number,
  tailArrowClass: any
}

export function slidy (slider: any, options: Options) {
  const {
    ease,
    frameDOMEl,
    infinite,
    items,
    itemsPreloaded,
    rewind,
    rewindSpeed,
    slideSpeed,
    tailArrowClass
  } = options

  // if frameDOMEl is null, then we do nothing
  if (frameDOMEl === null) return
  // DOM elements
  const slideContainerDOMEl = frameDOMEl.getElementsByClassName(options.classNameSlideContainer)[0]

  const prevArrow = frameDOMEl.getElementsByClassName(options.classNamePrevCtrl)[0]
  const nextArrow = frameDOMEl.getElementsByClassName(options.classNameNextCtrl)[0]

  // initialize some variables
  let frameWidth: number = 0
  let index: number = 0
  let loadedIndex: Array<number> = []
  let maxOffset: number = 0
  let position: number = 0
  let slides: Array<any> = []
  let transitionEndCallback : Function
  let transitionEndCallbackActivated : boolean = false

  let itemsPreloadedCount: number = itemsPreloaded
  while (itemsPreloadedCount--) loadedIndex[itemsPreloadedCount] = 1

  // event handling
  let touchOffset = { pageX: 0, pageY: 0 }
  let currentTouchOffset = { pageX: 0, pageY: 0 }
  let delta = { x: 0, y: 0 }
  let isScrolling = false

  // clamp a number between two min and max values
  function _clampNumber (x: number, minValue: number, maxValue: number) {
    return min(max(x, minValue), maxValue)
  }

  // get the width from a DOM element
  function _getWidthFromDOMEl (el: HTMLElement) {
    return el.getBoundingClientRect().width
  }

  // calculate the offset with the width of the frame and the desired position
  function _getOffsetLeft (slidePosition: number) {
    return frameWidth * slidePosition
  }

  /**
   * private
   * _setupInfinite: function to setup if infinite is set
   *
   * @param  {array} slideArray
   * @return {array} array of updated slideContainer elements
   */
  function _setupInfinite (slideArray: Array<HTMLElement>) {
    const totalSlides = slideArray.length
    const front = slideArray.slice(0, 1)
    const back = slideArray.slice(totalSlides - 1, totalSlides)
    const { firstChild } = slideContainerDOMEl

    front.forEach(function (el: HTMLElement) {
      const cloned = el.cloneNode(true)
      slideContainerDOMEl.appendChild(cloned)
    })

    back.reverse()
      .forEach(function (el: HTMLElement) {
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
  function _translate (to: number, duration: number, ease: string = '') {
    const easeCssText = ease !== '' ? `${prefixes.transitionTiming}: ${ease};` : ''
    const durationCssText = duration ? `${prefixes.transitionDuration}: ${duration}ms;` : ''
    const cssText = `${easeCssText}${durationCssText}
      ${prefixes.transform}: ${prefixes.translate(to)};`

    slideContainerDOMEl.style.cssText = cssText
  }

  function _setTailArrowClasses () {
    if (infinite === true) { return }
    if (prevArrow !== null && typeof prevArrow.classList === 'object') {
      const action = index < 1 ? 'add' : 'remove'
      prevArrow.classList[action](tailArrowClass)
    }
    if (nextArrow !== null && typeof nextArrow.classList === 'object') {
      const action = index > options.items.length - 2 ? 'add' : 'remove'
      nextArrow.classList[action](tailArrowClass)
    }
  }

  /**
   * slidefunction called by prev, next & touchend
   *
   * determine nextIndex and slide to next postion
   * under restrictions of the defined options
   *
   * @direction  {boolean} 'true' for right, 'false' for left
   */
  function slide (direction: boolean) {
    let duration = slideSpeed

    const movement : number = direction === true ? 1 : -1
    const totalSlides = slides.length

    // calculate the nextIndex according to the movement
    let nextIndex = index + (SLIDES_TO_SCROLL * movement)

    // nextIndex should be between 0 and totalSlides minus 1
    nextIndex = _clampNumber(nextIndex, 0, totalSlides - 1)

    if (infinite === true && direction === undefined) {
      nextIndex += infinite
    }

    let nextOffset = _clampNumber(_getOffsetLeft(nextIndex) * -1, maxOffset * -1, 0)

    if (rewind === true && direction && abs(position) === maxOffset) {
      nextOffset = 0
      nextIndex = 0
      duration = rewindSpeed
    }

    const needToSlide = nextIndex !== index
    if (needToSlide === false) return

    // translate to the nextOffset by a defined duration and ease function
    _translate(nextOffset, duration, ease)

    // update the position with the next position
    position = nextOffset

    // if the nextIndex is possible according to totalSlides, then use it
    if (nextIndex <= totalSlides) {
      options.doBeforeSlide({ currentSlide: index, nextSlide: nextIndex })
      index = nextIndex
    }

    if (infinite === true && (nextIndex === (totalSlides - 1) || nextIndex === 0)) {
      index = direction === 1 ? 1 : totalSlides - 2

      position = _getOffsetLeft(index) * -1

      transitionEndCallback = function () {
        _translate(_getOffsetLeft(index) * -1, 0)
      }
      transitionEndCallbackActivated = true
    } else {
      const indexToLoad = index + (SLIDES_TO_SCROLL * movement) - 1
      // check if the slide has been loaded before
      const indexLoaded = !!loadedIndex[indexToLoad]
      if (indexToLoad < totalSlides && indexToLoad >= 0 && !indexLoaded) {
        // insert in the correct position
        slideContainerDOMEl.appendChild(slides[indexToLoad])
        loadedIndex[indexToLoad] = 1
      }
    }

    // Checking wheter to paint or hide the arrows.
    _setTailArrowClasses()

    options.doAfterSlide({ currentSlide: index })
  }

  function _removeTouchEventsListeners (all: boolean = false) {
    frameDOMEl.removeEventListener('touchmove', onTouchmove)
    frameDOMEl.removeEventListener('touchend', onTouchend)
    frameDOMEl.removeEventListener('touchcancel', onTouchend)
    if (all === true) {
      frameDOMEl.removeEventListener('touchstart', onTouchstart)
    }
  }

  function _removeAllEventsListeners () {
    _removeTouchEventsListeners(true)
    slideContainerDOMEl.removeEventListener(prefixes.transitionEnd, onTransitionEnd)
    window.removeEventListener('resize', onResize)
  }

  function onTransitionEnd () {
    if (transitionEndCallbackActivated === true) {
      transitionEndCallback()
      transitionEndCallbackActivated = false
    }
  }

  function getTouchCoordinatesFromEvent (event: TouchEvent) {
    return event.targetTouches ? event.targetTouches[0] : event.touches[0]
  }

  function onTouchstart (event: TouchEvent) {
    const { pageX, pageY } : Coordinates = getTouchCoordinatesFromEvent(event)
    touchOffset = currentTouchOffset = { pageX, pageY }
    frameDOMEl.addEventListener('touchmove', onTouchmove, { pasive: true })
    frameDOMEl.addEventListener('touchend', onTouchend, { pasive: true })
    frameDOMEl.addEventListener('touchcancel', onTouchend, { pasive: true })
  }

  function onTouchmove (event: TouchEvent) {
    const { pageX, pageY } : Coordinates = getTouchCoordinatesFromEvent(event)

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

    if (navigator.userAgent.indexOf('Android 4.3') >= 0 && isScrollingNow === false) {
      event.preventDefault()
    }

    if (isScrolling === false && delta.x !== 0) {
      _translate(round(position + delta.x), 0)
    } else if (isScrolling === true) {
      onTouchend(event)
    }
  }

  function onTouchend (event: TouchEvent) {
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
    const isOutOfBounds = (index === 0 && direction === false) ||
        (index === slides.length - 1 && direction === true)

    if (isValid === true && isOutOfBounds === false) {
      slide(direction)
    } else {
      _translate(position, options.snapBackSpeed, LINEAR_ANIMATION)
    }

    delta = {}
    touchOffset = {}
    isScrolling = false

    _removeTouchEventsListeners()
  }

  function _convertItemToDOM (itemString: string) {
    const wrappedString = `<li class='${options.classNameItem}'>${itemString}</li>`
    const el = document.createElement('template')
    if (typeof el.content === 'object') {
      el.innerHTML = wrappedString
      return el.content
    } else {
      const container = document.createElement('ul')
      const fragment = document.createDocumentFragment()
      container.innerHTML = wrappedString
      while (container.firstChild !== null && container.firstChild !== undefined) {
        fragment.appendChild(container.firstChild)
      }
      return fragment
    }
  }

  function onResize () {
    reset()
  }

  /**
   * public
   * setup function
   */
  function _setup () {
    const { infinite } = options
    const slidesArray = slice.call(items.map(_convertItemToDOM))
    position = slideContainerDOMEl.offsetLeft

    slides = infinite === true ? _setupInfinite(slidesArray) : slice.call(slidesArray)

    _setTailArrowClasses()
    reset()

    slideContainerDOMEl.addEventListener(prefixes.transitionEnd, onTransitionEnd)
    frameDOMEl.addEventListener('touchstart', onTouchstart, { passive: true })
    window.addEventListener('resize', onResize)
  }

  /**
   * public
   * reset function: called on resize
   */
  function reset () {
    const {infinite, rewindOnResize} = options
    let { ease, rewindSpeed } = options

    frameWidth = _getWidthFromDOMEl(frameDOMEl)
    maxOffset = round((frameWidth * slides.length) - frameWidth)

    if (rewindOnResize === true) {
      index = 0
    } else {
      ease = ''
      rewindSpeed = 0
    }

    index = infinite === true ? index + 1 : index
    position = _getOffsetLeft(index) * -1
    return infinite === true
            ? _translate(position, 0)
            : _translate(position, rewindSpeed, ease)
  }

  /**
   * public
   * returnIndex function: called on clickhandler
   */
  function returnIndex () {
    return index
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
    _removeAllEventsListeners()
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
