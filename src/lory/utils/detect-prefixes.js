const TRANSLATE_3D_INIT = 'translate3d(0, 0, 0)'

// Detect prefixes for saving time and bytes
export default function detectPrefixes () {
  let transform
  let transition
  let transitionEnd
  let translate

  (function () {
    const el = document.createElement('div')
    const style = el.style
    let prop

    if (style[prop = 'webkitTransition'] === '') {
      transitionEnd = 'webkitTransitionEnd'
      transition = prop
    }

    if (style[prop = 'transition'] === '') {
      transitionEnd = 'transitionend'
      transition = prop
    }

    if (style[prop = 'webkitTransform'] === '') {
      transform = '-webkit-transform'
    }

    if (style[prop = 'msTransform'] === '') {
      transform = '-ms-transform'
    }

    if (style[prop = 'transform'] === '') {
      transform = prop
    }

    document.body.insertBefore(el, null)
    style[transform] = TRANSLATE_3D_INIT
    const hasTranslate3d = !!el.style.getPropertyValue(transform)

    translate = (function () {
      return hasTranslate3d
        ? function (to) { return 'translate3d(' + to + 'px, 0, 0)' }
        : function (to) { return 'translate(' + to + 'px, 0)' }
    }())

    document.body.removeChild(el)
  }())

  return {
    transform,
    translate,
    transition,
    transitionEnd,
    transitionTiming: transition + '-timing-function',
    transitionDuration: transition + '-duration'
  }
}
