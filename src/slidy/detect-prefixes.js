const EMPTY_STRING = ''

// Detect prefixes for saving time and bytes
export default function detectPrefixes () {
  let transform
  let transition
  let transitionEnd

  const style = document.createElement('div').style
  let prop

  if (style[prop = 'webkitTransition'] === EMPTY_STRING) {
    transitionEnd = 'webkitTransitionEnd'
    transition = prop
  }

  if (style[prop = 'transition'] === EMPTY_STRING) {
    transitionEnd = 'transitionend'
    transition = prop
  }

  if (style[prop = 'webkitTransform'] === EMPTY_STRING) {
    transform = '-webkit-transform'
  }

  if (style[prop = 'msTransform'] === EMPTY_STRING) {
    transform = '-ms-transform'
  }

  if (style[prop = 'transform'] === EMPTY_STRING) {
    transform = prop
  }

  const translate = typeof style.perspective !== 'undefined'
    ? function (to) { return 'translate3d(' + to + 'px, 0, 0)' }
    : function (to) { return 'translate(' + to + 'px, 0)' }

  return {
    transform,
    transition,
    transitionEnd,
    translate,
    transitionDuration: transition + '-duration',
    transitionTiming: transition + '-timing-function'
  }
}
