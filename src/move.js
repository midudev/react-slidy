/* Heavily inspired on smoothscroll polyfill of iamdustan: https://github.com/iamdustan/smoothscroll/blob/master/src/smoothscroll.js */
const SCROLL_TIME = 468
const d = document
const w = window

// returns result of applying ease math function to a number
const ease = (k) => 0.5 * (1 - Math.cos(Math.PI * k))

// Get the best way to calculate now time
const now = w.performance && w.performance.now
  ? w.performance.now.bind(w.performance)
  : Date.now

// Changes scroll position inside an element
function scrollElement (x) {
  this.scrollLeft = x
}

function moveScrollNative (el, x) {
  el.scrollTo({ left: x, behavior: 'smooth' })
}

function moveScrollPolyfilled (el, x) {
  step({
    x,
    method: scrollElement,
    scrollable: el,
    startTime: now(),
    startX: el.scrollLeft,
  })
}

// self invoked function that, given a context, steps through scrolling
function step (context) {
  const time = now()
  let elapsed = (time - context.startTime) / SCROLL_TIME
  // avoid elapsed times higher than one
  elapsed = elapsed > 1 ? 1 : elapsed
  // apply easing to elapsed time
  const value = ease(elapsed)

  const currentX = context.startX + (context.x - context.startX) * value

  context.method.call(context.scrollable, currentX)
  // scroll more if we have not reached our destination
  if (currentX !== context.x) {
    w.requestAnimationFrame(step.bind(w, context))
  }
}

// use native or polyfilled according to the support of the browser
export const moveScroll = 'scrollBehavior' in d.documentElement.style
  ? moveScrollNative
  : moveScrollPolyfilled
