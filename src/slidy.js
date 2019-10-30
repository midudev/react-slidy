const LINEAR_ANIMATION = 'linear'
const VALID_SWIPE_DISTANCE = 50
const TRANSITION_END = 'transitionend'
const {abs} = Math
const EVENT_OPTIONS = {passive: false}

function translate(to, moveX, percentatge = 100) {
  const translation = to * percentatge * -1
  return moveX
    ? `translate3d(calc(${translation}% - ${moveX}px), 0, 0)`
    : `translate3d(${translation}%, 0, 0)`
}

function clampNumber(x, minValue, maxValue) {
  return Math.min(Math.max(x, minValue), maxValue)
}

function getTouchCoordinatesFromEvent(e) {
  const {pageX, pageY} = e.targetTouches ? e.targetTouches[0] : e.touches[0]
  return {pageX, pageY}
}

function getTranslationCSS(duration, ease, index, x, percentatge) {
  const easeCssText = ease !== '' ? `transition-timing-function: ${ease};` : ''
  const durationCssText = duration ? `transition-duration: ${duration}ms;` : ''
  return `${easeCssText}${durationCssText}transform: ${translate(
    index,
    x,
    percentatge
  )};`
}

function cleanContainer(container) {
  // remove all the elements except the last one as it seems to be old data in the HTML
  // that's specially useful for dynamic content
  while (container.childElementCount > 1) {
    container !== null && container.removeChild(container.lastChild)
  }
  // tell that the clean is done
  return true
}

export default function slidy(containerDOMEl, options) {
  const {
    doAfterSlide,
    doBeforeSlide,
    ease,
    initialSlide,
    numOfSlides,
    onNext,
    onPrev,
    slidesDOMEl,
    slideSpeed
  } = options
  let {items} = options

  // if frameDOMEl is null, then we do nothing
  if (containerDOMEl === null) return

  // initialize some variables
  let index = initialSlide
  let isScrolling = false
  let transitionEndCallbackActivated = false

  // event handling
  let deltaX = 0
  let deltaY = 0
  let touchOffsetX = 0
  let touchOffsetY = 0

  /**
   * translates to a given position in a given time in milliseconds
   *
   * @duration  {number} time in milliseconds for the transistion
   * @ease      {string} easing css property
   * @x         {number} Number of pixels to fine tuning translation
   */
  function _translate(duration, ease = '', x = false) {
    const percentatge = 100 / numOfSlides
    slidesDOMEl.style.cssText = getTranslationCSS(
      duration,
      ease,
      index,
      x,
      percentatge
    )
  }

  /**
   * slide function called by prev, next & touchend
   *
   * determine nextIndex and slide to next postion
   * under restrictions of the defined options
   *
   * @direction  {boolean} 'true' for right, 'false' for left
   */
  function slide(direction) {
    const movement = direction === true ? 1 : -1
    const duration = slideSpeed

    // calculate the nextIndex according to the movement
    let nextIndex = index + 1 * movement

    // nextIndex should be between 0 and items minus 1
    nextIndex = clampNumber(nextIndex, 0, items - 1)

    // if the nextIndex and the current is the same, we don't need to do the slide
    if (nextIndex === index) return

    // if the nextIndex is possible according to number of items, then use it
    if (nextIndex <= items) {
      // execute the callback from the options before sliding
      doBeforeSlide({currentSlide: index, nextSlide: nextIndex})
      // execute the internal callback
      direction ? onNext(nextIndex) : onPrev(nextIndex)
      index = nextIndex
    }

    // translate to the next index by a defined duration and ease function
    _translate(duration, ease)

    // execute the callback from the options after sliding
    slidesDOMEl.addEventListener(TRANSITION_END, function cb(e) {
      doAfterSlide({currentSlide: index})
      e.currentTarget.removeEventListener(e.type, cb)
    })
  }

  function _removeTouchEventsListeners(all = false) {
    containerDOMEl.removeEventListener(
      'touchstart',
      onTouchstart,
      EVENT_OPTIONS
    )
    containerDOMEl.removeEventListener('touchmove', onTouchmove, EVENT_OPTIONS)
    containerDOMEl.removeEventListener('touchend', onTouchend, EVENT_OPTIONS)
  }

  function _removeAllEventsListeners() {
    _removeTouchEventsListeners(true)
    slidesDOMEl.removeEventListener(TRANSITION_END, onTransitionEnd)
  }

  function onTransitionEnd() {
    if (transitionEndCallbackActivated === true) {
      _translate(0)
      transitionEndCallbackActivated = false
    }
  }

  function onTouchstart(e) {
    const coords = getTouchCoordinatesFromEvent(e)
    isScrolling = undefined
    touchOffsetX = coords.pageX
    touchOffsetY = coords.pageY
  }

  function onTouchmove(e) {
    // ensure swiping with one touch and not pinching
    if (e.touches.length > 1 || (e.scale && e.scale !== 1)) return

    const coords = getTouchCoordinatesFromEvent(e)
    deltaX = coords.pageX - touchOffsetX
    deltaY = coords.pageY - touchOffsetY

    if (typeof isScrolling === 'undefined') {
      isScrolling = abs(deltaX) < abs(deltaY)
      if (!isScrolling) document.ontouchmove = e => e.preventDefault()
      return
    }

    if (!isScrolling) {
      e.preventDefault()
      _translate(0, LINEAR_ANIMATION, deltaX * -1)
    }
  }

  function onTouchend(event) {
    document.ontouchmove = () => true
    if (!isScrolling) {
      /**
       * is valid if:
       * -> swipe distance is greater than the specified valid swipe distance
       * -> swipe distance is more then a third of the swipe area
       * @isValidSlide {Boolean}
       */
      const isValid = abs(deltaX) > VALID_SWIPE_DISTANCE

      /**
       * is out of bounds if:
       * -> index is 0 and deltaX is greater than 0
       * -> index is the last slide and deltaX is smaller than 0
       * @isOutOfBounds {Boolean}
       */
      const direction = deltaX < 0
      const isOutOfBounds =
        (direction === false && index === 0) ||
        (direction === true && index === items - 1)

      if (isValid === true && isOutOfBounds === false) {
        slide(direction)
      } else {
        _translate(slideSpeed, LINEAR_ANIMATION)
      }
    }

    // reset variables with the initial values
    deltaX = deltaY = touchOffsetX = touchOffsetY = 0
  }

  /**
   * public
   * setup function
   */
  function _setup() {
    slidesDOMEl.addEventListener(TRANSITION_END, onTransitionEnd)
    containerDOMEl.addEventListener('touchstart', onTouchstart, EVENT_OPTIONS)
    containerDOMEl.addEventListener('touchmove', onTouchmove, EVENT_OPTIONS)
    containerDOMEl.addEventListener('touchend', onTouchend, EVENT_OPTIONS)

    if (index !== 0) {
      _translate(0)
    }
  }

  /**
   * public
   * clean content of the slider
   */
  function clean() {
    return cleanContainer(slidesDOMEl)
  }

  /**
   * public
   * prev function: called on clickhandler
   */
  function prev(e) {
    e.preventDefault()
    e.stopPropagation()
    slide(false)
  }

  /**
   * public
   * next function: called on clickhandler
   */
  function next(e) {
    e.preventDefault()
    e.stopPropagation()
    slide(true)
  }

  /**
   * public
   * @param {number} newItems Number of items in the slider for dynamic content
   */
  function updateItems(newItems) {
    items = newItems
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
    slide,
    updateItems
  }
}
