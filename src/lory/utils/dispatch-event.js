// create cross-browser custom event initializer
const createCustomEvent = (function () {
  if (window.CustomEvent) {
    return function (type, detail) {
      return new window.CustomEvent(type, { detail })
    }
  } else {
    return function (type, detail) {
      const event = document.createEvent('CustomEvent')
      event.initCustomEvent(type, true, true, detail)
      return event
    }
  }
}())

/**
 * dispatch custom events
 *
 * @param  {element} el         slideshow element
 * @param  {string}  type       custom event name
 * @param  {object}  detail     custom detail information
 */

export default function dispatchEvent (target, type, detail) {
  const event = createCustomEvent(type, detail)
  target.dispatchEvent(event)
}
