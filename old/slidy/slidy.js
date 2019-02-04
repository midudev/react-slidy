// @flow
const { slice } = Array.prototype

const LINEAR_ANIMATION = 'linear'
const SLIDES_TO_SCROLL = 1
const VALID_SWIPE_DISTANCE = 25
const {abs, min, max, round} = Math

const PREFIXES = {
  transform: 'transform',
  transition: 'transition',
  transitionDuration: 'transition-duration',
  transitionEnd: 'transitionend',
  transitionTiming: 'transition-timing-function',
  translate: function (to) { return 'translate3d(' + to + 'px, 0, 0)' },
}

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
  initialSlide: number,
  items: Array<string>,
  itemsToPreload: number,
  rewind: boolean,
  rewindOnResize: boolean,
  rewindSpeed: number,
  slideSpeed: number,
  snapBackSpeed: number,
  snapBackSpeed: number,
  tailArrowClass: string
}

export function slidy (slider: any, options: Options) {
  const {
    classNameItem,
    classNameNextCtrl,
    classNamePrevCtrl,
    classNameSlideContainer,
    doAfterSlide,
    doBeforeSlide,
    ease,
    frameDOMEl,
    infinite,
    initialSlide,
    items,
    itemsToPreload,
    rewind,
    rewindOnResize,
    rewindSpeed,
    slideSpeed,
    snapBackSpeed,
    tailArrowClass
  } = options

  // if frameDOMEl is null, then we do nothing
  if (frameDOMEl === null) return
  // DOM elements
  const slideContainerDOMEl = frameDOMEl.getElementsByClassName(classNameSlideContainer)[0]
  const nextArrow = frameDOMEl.getElementsByClassName(classNameNextCtrl)[0]
  const prevArrow = frameDOMEl.getElementsByClassName(classNamePrevCtrl)[0]

  // initialize some variables
  let frameWidth: number = 0
  let index: number = initialSlide
  let isScrolling = false
  let isScrollBlocked = false
  let loadedIndex: Array<number> = []
  let maxOffset: number = 0
  let position: number = 0
  let slides: Array<any> = []
  let transitionEndCallbackActivated : boolean = false

  let itemsPreloadedCount: number = itemsToPreload
  while (itemsPreloadedCount--) loadedIndex[index + itemsPreloadedCount] = 1

  // event handling
  let touchOffset = { pageX: 0, pageY: 0 }
  let deltaX = 0
  let deltaY = 0

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
    if (frameWidth === 0) frameWidth = _getWidthFromDOMEl(frameDOMEl)
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
    const easeCssText = ease !== '' ? `${PREFIXES.transitionTiming}: ${ease};` : ''
    const durationCssText = duration ? `${PREFIXES.transitionDuration}: ${duration}ms;` : ''
    const cssText = `${easeCssText}${durationCssText}
      ${PREFIXES.transform}: ${PREFIXES.translate(to)};`

    slideContainerDOMEl.style.cssText = cssText
  }

  function _setTailArrowClasses () {
    if (infinite === true) { return }
    if (prevArrow !== null && typeof prevArrow.classList === 'object') {
      const action = index < 1 ? 'add' : 'remove'
      prevArrow.classList[action](tailArrowClass)
    }
    if (nextArrow !== null && typeof nextArrow.classList === 'object') {
      const action = index > items.length - 2 ? 'add' : 'remove'
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
    const movement : number = direction === true ? 1 : -1
    const totalSlides = slides.length
    let duration = slideSpeed

    // calculate the nextIndex according to the movement
    let nextIndex = index + (SLIDES_TO_SCROLL * movement)

    // nextIndex should be between 0 and totalSlides minus 1
    nextIndex = _clampNumber(nextIndex, 0, totalSlides - 1)

    if (infinite === true && direction === undefined) {
      nextIndex += infinite
    }

    let nextOffset = _getOffsetLeft(nextIndex) * -1

    if (rewind === true && direction && abs(position) === maxOffset) {
      nextOffset = 0
      nextIndex = 0
      duration = rewindSpeed
    }

    // if the nextIndex and the current is the same, we don't need to do the slide
    if (nextIndex === index) return

    // translate to the nextOffset by a defined duration and ease function
    _translate(nextOffset, duration, ease)

    // update the position with the next position
    position = nextOffset

    // if the nextIndex is possible according to totalSlides, then use it
    if (nextIndex <= totalSlides) {
      // execute the callback from the options before sliding
      doBeforeSlide({ currentSlide: index, nextSlide: nextIndex })
      index = nextIndex
    }

    if (infinite === true && (nextIndex === (totalSlides - 1) || nextIndex === 0)) {
      index = direction === true ? 1 : totalSlides - 2
      position = _getOffsetLeft(index) * -1
      transitionEndCallbackActivated = true
    } else {
      const indexToLoad = index + (SLIDES_TO_SCROLL * movement) - 1
      // check if the slide has been loaded before and if the index to load is correct
      if (indexToLoad < totalSlides && indexToLoad >= 0 && !loadedIndex[indexToLoad]) {
        // insert in the correct position
        slideContainerDOMEl.appendChild(slides[indexToLoad])
        loadedIndex[indexToLoad] = 1
      }
    }

    // Checking wheter to paint or hide the arrows.
    _setTailArrowClasses()

    // execute the callback from the options after sliding
    doAfterSlide({ currentSlide: index })
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
    slideContainerDOMEl.removeEventListener(PREFIXES.transitionEnd, onTransitionEnd)
    window.removeEventListener('resize', onResize)
  }

  function onTransitionEnd () {
    if (transitionEndCallbackActivated === true) {
      _translate(_getOffsetLeft(index) * -1, 0)
      transitionEndCallbackActivated = false
    }
  }

  function getTouchCoordinatesFromEvent (event: TouchEvent) {
    return event.targetTouches ? event.targetTouches[0] : event.touches[0]
  }

  function onTouchstart (event: TouchEvent) {
    const { pageX, pageY } : Coordinates = getTouchCoordinatesFromEvent(event)
    touchOffset = { pageX, pageY }
    frameDOMEl.addEventListener('touchmove', onTouchmove)
    frameDOMEl.addEventListener('touchend', onTouchend, { passive: true })
    frameDOMEl.addEventListener('touchcancel', onTouchend, { passive: true })
  }

  function onTouchmove (event: TouchEvent) {
    const { pageX, pageY } : Coordinates = getTouchCoordinatesFromEvent(event)
    deltaX = pageX - touchOffset.pageX
    deltaY = pageY - touchOffset.pageY

    const absDeltaY = abs(deltaY)
    isScrolling = isScrolling === true ||
      (isScrollBlocked === false && absDeltaY >= 0 && absDeltaY >= abs(deltaX))

    if (isScrolling === false && deltaX !== 0) {
      isScrollBlocked = true
      _translate(round(position + deltaX), 0)
    }

    if (isScrollBlocked === true) {
      event.preventDefault()
    }
  }

  function onTouchend (event: TouchEvent) {
    if (isScrolling === false) {
      /**
      * is valid if:
      * -> swipe distance is greater than the specified valid swipe distance
      * -> swipe distance is more then a third of the swipe area
      * @isValidSlide {Boolean}
      */
      const absoluteX = abs(deltaX)
      const isValid = absoluteX > VALID_SWIPE_DISTANCE || absoluteX > frameWidth / 3

      /**
      * is out of bounds if:
      * -> index is 0 and deltaX is greater than 0
      * -> index is the last slide and deltaX is smaller than 0
      * @isOutOfBounds {Boolean}
      */
      const direction = deltaX < 0
      const isOutOfBounds = (direction === false && index === 0) ||
          (direction === true && index === slides.length - 1)

      if (isValid === true && isOutOfBounds === false) {
        slide(direction)
      } else {
        _translate(position, snapBackSpeed, LINEAR_ANIMATION)
      }
    }

    // reset variables with the initial values
    deltaX = 0
    deltaY = 0
    isScrolling = false
    isScrollBlocked = false
    touchOffset = {}

    _removeTouchEventsListeners()
  }

  function _convertItemToDOM (itemString: string) {
    const wrappedString = `<li class='${classNameItem}'>${itemString}</li>`
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
    const slidesArray = slice.call(items.map(_convertItemToDOM))
    position = slideContainerDOMEl.offsetLeft

    slides = infinite === true ? _setupInfinite(slidesArray) : slidesArray

    _setTailArrowClasses()
    reset()

    slideContainerDOMEl.addEventListener(PREFIXES.transitionEnd, onTransitionEnd, { passive: true })
    frameDOMEl.addEventListener('touchstart', onTouchstart, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
  }

  /**
   * public
   * clean content of the slider
   */
  function clean () {
    // remove all the elements except the last one as it seems to be old data in the HTML
    // that's specially useful for dynamic content
    while (slideContainerDOMEl.childElementCount > 1) {
      slideContainerDOMEl !== null && slideContainerDOMEl.removeChild(slideContainerDOMEl.lastChild)
    }
    // tell that the clean is done
    return true
  }

  /**
  * public
  * reset function: called on resize
  */
  function reset () {
    frameWidth = _getWidthFromDOMEl(frameDOMEl)
    maxOffset = round((frameWidth * slides.length) - frameWidth)

    index = rewindOnResize === true ? 0 : index
    // we have to extract the initialSlide from the index to calculate the offset
    // so we make sure that we start the translations from point 0 no matter
    // the initial index used
    position = _getOffsetLeft(index) * -1

    if (infinite === true) {
      _translate(position, 0)
    } else {
      const easeToUse = rewindOnResize === true ? ease : ''
      const rewindSpeedToUse = rewindOnResize === true ? rewindSpeed : 0
      _translate(position, rewindSpeedToUse, easeToUse)
    }
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

  // trigger initial setup, wait 100MS in order to avoid problems with width
  _setup()

  // expose public api
  return {
    clean,
    destroy,
    next,
    prev,
    reset,
    returnIndex,
    slide
  }
}
