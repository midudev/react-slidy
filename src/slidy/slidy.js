const {slice} = Array.prototype

const LINEAR_ANIMATION = 'linear'
const SLIDES_TO_SCROLL = 1
const VALID_SWIPE_DISTANCE = 50
const {abs, min, max} = Math

const PREFIXES = {
  transform: 'transform',
  transition: 'transition',
  transitionDuration: 'transition-duration',
  transitionEnd: 'transitionend',
  transitionTiming: 'transition-timing-function',
  translate: function(to, x) {
    return x
      ? `translate3d(calc(-${to * 100}% - ${x}px), 0, 0)`
      : `translate3d(-${to * 100}%, 0, 0)`
  }
}

export function slidy(slider, options) {
  const {
    classNameItem,
    classNameNextCtrl,
    classNamePrevCtrl,
    classNameSlideContainer,
    doAfterSlide,
    doBeforeSlide,
    ease,
    frameDOMEl,
    initialSlide,
    items,
    itemsToPreload,
    rewind,
    rewindSpeed,
    slideSpeed,
    snapBackSpeed,
    tailArrowClass
  } = options

  // if frameDOMEl is null, then we do nothing
  if (frameDOMEl === null) return
  // DOM elements
  const slideContainerDOMEl = frameDOMEl.getElementsByClassName(
    classNameSlideContainer
  )[0]
  const nextArrow = frameDOMEl.getElementsByClassName(classNameNextCtrl)[0]
  const prevArrow = frameDOMEl.getElementsByClassName(classNamePrevCtrl)[0]

  // initialize some variables
  let index = initialSlide
  let isScrolling = false
  let isScrollBlocked = false
  let loadedIndex = []
  let slides = []
  let transitionEndCallbackActivated = false

  let itemsPreloadedCount = itemsToPreload
  while (itemsPreloadedCount--) loadedIndex[index + itemsPreloadedCount] = 1

  // event handling
  let touchOffset = {pageX: 0, pageY: 0}
  let deltaX = 0
  let deltaY = 0

  // clamp a number between two min and max values
  function _clampNumber(x, minValue, maxValue) {
    return min(max(x, minValue), maxValue)
  }

  /**
   * translates to a given position in a given time in milliseconds
   *
   * @duration  {number} time in milliseconds for the transistion
   * @ease      {string} easing css property
   * @x         {number} Number of pixels to fine tuning translation
   */
  function _translate(duration, ease = '', x = false) {
    const easeCssText =
      ease !== '' ? `${PREFIXES.transitionTiming}: ${ease};` : ''
    const durationCssText = duration
      ? `${PREFIXES.transitionDuration}: ${duration}ms;`
      : ''
    const cssText = `${easeCssText}${durationCssText}
      ${PREFIXES.transform}: ${PREFIXES.translate(index, x)};`

    slideContainerDOMEl.style.cssText = cssText
  }

  function _setTailArrowClasses() {
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
  function slide(direction) {
    const movement = direction === true ? 1 : -1
    const totalSlides = slides.length
    let duration = slideSpeed

    // calculate the nextIndex according to the movement
    let nextIndex = index + SLIDES_TO_SCROLL * movement

    // nextIndex should be between 0 and totalSlides minus 1
    nextIndex = _clampNumber(nextIndex, 0, totalSlides - 1)

    if (rewind === true && direction) {
      nextIndex = 0
      duration = rewindSpeed
    }

    // if the nextIndex and the current is the same, we don't need to do the slide
    if (nextIndex === index) return

    // if the nextIndex is possible according to totalSlides, then use it
    if (nextIndex <= totalSlides) {
      // execute the callback from the options before sliding
      doBeforeSlide({currentSlide: index, nextSlide: nextIndex})
      index = nextIndex
    }

    // translate to the next index by a defined duration and ease function
    _translate(duration, ease)

    const indexToLoad = index + SLIDES_TO_SCROLL * movement - 1
    // check if the slide has been loaded before and if the index to load is correct
    if (
      indexToLoad < totalSlides &&
      indexToLoad >= 0 &&
      !loadedIndex[indexToLoad]
    ) {
      // insert in the correct position
      slideContainerDOMEl.appendChild(slides[indexToLoad])
      loadedIndex[indexToLoad] = 1
    }

    // Checking wheter to paint or hide the arrows.
    _setTailArrowClasses()

    // execute the callback from the options after sliding
    doAfterSlide({currentSlide: index})
  }

  function _removeTouchEventsListeners(all = false) {
    frameDOMEl.removeEventListener('touchmove', onTouchmove)
    frameDOMEl.removeEventListener('touchend', onTouchend)
    frameDOMEl.removeEventListener('touchcancel', onTouchend)

    if (all === true) {
      frameDOMEl.removeEventListener('touchstart', onTouchstart)
    }
  }

  function _removeAllEventsListeners() {
    _removeTouchEventsListeners(true)
    slideContainerDOMEl.removeEventListener(
      PREFIXES.transitionEnd,
      onTransitionEnd
    )
  }

  function onTransitionEnd() {
    if (transitionEndCallbackActivated === true) {
      _translate(0)
      transitionEndCallbackActivated = false
    }
  }

  function getTouchCoordinatesFromEvent(event) {
    return event.targetTouches ? event.targetTouches[0] : event.touches[0]
  }

  function onTouchstart(event) {
    const {pageX, pageY} = getTouchCoordinatesFromEvent(event)
    touchOffset = {pageX, pageY}
    frameDOMEl.addEventListener('touchmove', onTouchmove)
    frameDOMEl.addEventListener('touchend', onTouchend, {passive: true})
    frameDOMEl.addEventListener('touchcancel', onTouchend, {passive: true})
  }

  function onTouchmove(event) {
    const {pageX, pageY} = getTouchCoordinatesFromEvent(event)
    deltaX = pageX - touchOffset.pageX
    deltaY = pageY - touchOffset.pageY

    const absDeltaY = abs(deltaY)
    isScrolling =
      isScrolling === true ||
      (isScrollBlocked === false && absDeltaY >= 0 && absDeltaY >= abs(deltaX))

    if (isScrolling === false && deltaX !== 0) {
      isScrollBlocked = true
      _translate(0, LINEAR_ANIMATION, deltaX * -1)
    }

    if (isScrollBlocked === true) {
      event.preventDefault()
    }
  }

  function onTouchend(event) {
    if (isScrolling === false) {
      /**
       * is valid if:
       * -> swipe distance is greater than the specified valid swipe distance
       * -> swipe distance is more then a third of the swipe area
       * @isValidSlide {Boolean}
       */
      const absoluteX = abs(deltaX)
      const isValid = absoluteX > VALID_SWIPE_DISTANCE

      /**
       * is out of bounds if:
       * -> index is 0 and deltaX is greater than 0
       * -> index is the last slide and deltaX is smaller than 0
       * @isOutOfBounds {Boolean}
       */
      const direction = deltaX < 0
      const isOutOfBounds =
        (direction === false && index === 0) ||
        (direction === true && index === slides.length - 1)

      if (isValid === true && isOutOfBounds === false) {
        slide(direction)
      } else {
        _translate(snapBackSpeed, LINEAR_ANIMATION)
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

  function _convertItemToDOM(itemString) {
    const wrappedString = `<li class='${classNameItem}'>${itemString}</li>`
    const el = document.createElement('template')
    if (typeof el.content === 'object') {
      el.innerHTML = wrappedString
      return el.content
    } else {
      const container = document.createElement('ul')
      const fragment = document.createDocumentFragment()
      container.innerHTML = wrappedString
      while (
        container.firstChild !== null &&
        container.firstChild !== undefined
      ) {
        fragment.appendChild(container.firstChild)
      }
      return fragment
    }
  }

  /**
   * public
   * setup function
   */
  function _setup() {
    slides = slice.call(items.map(_convertItemToDOM))

    _setTailArrowClasses()

    slideContainerDOMEl.addEventListener(
      PREFIXES.transitionEnd,
      onTransitionEnd,
      {passive: true}
    )
    frameDOMEl.addEventListener('touchstart', onTouchstart, {passive: true})

    if (index !== 0) {
      _translate(0)
    }
  }

  /**
   * public
   * clean content of the slider
   */
  function clean() {
    // remove all the elements except the last one as it seems to be old data in the HTML
    // that's specially useful for dynamic content
    while (slideContainerDOMEl.childElementCount > 1) {
      slideContainerDOMEl !== null &&
        slideContainerDOMEl.removeChild(slideContainerDOMEl.lastChild)
    }
    // tell that the clean is done
    return true
  }

  /**
   * public
   * returnIndex function: called on clickhandler
   */
  function returnIndex() {
    return index
  }

  /**
   * public
   * prev function: called on clickhandler
   */
  function prev() {
    slide(false)
  }

  /**
   * public
   * next function: called on clickhandler
   */
  function next() {
    slide(true)
  }

  /**
   * public
   * destroy function: called to gracefully destroy the slidy instance
   */
  function destroy() {
    _removeAllEventsListeners()
  }

  // trigger initial setup
  _setup()

  // expose public api
  return {
    clean,
    destroy,
    next,
    prev,
    returnIndex,
    slide
  }
}
