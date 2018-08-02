import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import debounce from 'just-debounce-it'

import { Arrow } from './Arrow'
import { Frame } from './Frame'

const NO_OP = () => {}

let moveScroll = NO_OP
// if window is present, then we get the needed library
if (typeof window !== 'undefined' && window.document) {
  require('intersection-observer')
  moveScroll = require('./move').moveScroll
}

export default class ReactSlidy extends Component {
  constructor (props) {
    super(props)
    this.observer = null
    this.state = {
      currentIndex: 0,
      showSlider: !this.props.lazyLoadSlider
    }

    this._frameDOMEl = undefined
    this._sliderDOMEl = undefined
    this._sliderWidth = 0
    this._slidesKey = 0
    this._slides = React.Children.toArray(this.props.children)

    /**
     * 0 - not in an elastic state.
     * -1 - elastic scrolling (back) to the left of scrollLeft 0.
     * 1 - elastic scrolling (fwd) to the right of the max scrollLeft possible.
     * @private {number}
     */
    this._elasticScrollState = 0

    this._getSliderWidth = this._getSliderWidth.bind(this)
    this._handleIntersection = this._handleIntersection.bind(this)
    this._handleNext = this._handleNext.bind(this)
    this._handlePrev = this._handlePrev.bind(this)
    this._handleResize = debounce(this._handleResize.bind(this), 200)
    this._handleAndroidScroll = this._handleAndroidScroll.bind(this)
    this._handleEndAndroidScroll = debounce(this._handleEndAndroidScroll.bind(this), 100)
    this._handleSlide = this._handleSlide.bind(this)
    this._handleTouchEnd = this._handleTouchEnd.bind(this)
    this._handleTouchStart = this._handleTouchStart.bind(this)
    this._setFrameRef = this._setFrameRef.bind(this)
  }

  componentDidMount () {
    if (this.props.lazyLoadSlider) {
      if (!('IntersectionObserver' in window)) { // check we support IntersectionObserver
        this.setState({ showSlider: true })
        return
      }
      // if we support IntersectionObserver, let's use it
      const { offset = 0 } = this.props.lazyLoadConfig
      this.observer = new window.IntersectionObserver(this._handleIntersection, {
        rootMargin: `${offset}px 0px 0px`
      })
      this.observer.observe(this._sliderDOMEl)
    }

    this._handleResize()
    window.addEventListener('resize', this._handleResize)
  }

  componentDidCatch (error, errorInfo) {
    console.error({ error, errorInfo })
  }

  // as it's a slider, we don't want to re-render it and don't expect
  // to add new childrens to it, so we don't want unexpected behaviour
  // expect if we specify we have dynamicContent on it
  shouldComponentUpdate (nextProps, nextState) {
    return true
    // return this.props.dynamicContent || nextState.showSlider !== this.state.showSlider
  }

  componentWillReceiveProps ({ children, dynamicContent }) {
    if (dynamicContent) {
      this._slides = React.Children.toArray(this.props.children)
      this._slidesKey++
    }
  }

  componentWillUnmount () {
    this.observer && this.observer.disconnect()
    window.removeEventListener('resize', this._handleResize)
  }

  _getSliderWidth ({ force = false } = {}) {
    if (this._sliderWidth === 0 || force) {
      this._sliderWidth = this._sliderDOMEl.clientWidth
    }
  }

  _handleIntersection ([entry], observer) {
    if (entry.isIntersecting || entry.intersectionRatio > 0) {
      observer.unobserve(entry.target)
      this.setState({ showSlider: true })
    }
  }

  _handleNext (e) {
    e.preventDefault()
    this._handleSlide({ direction: 1 })
  }

  _handlePrev (e) {
    e.preventDefault()
    this._handleSlide({ direction: -1 })
  }

  _handleTouchStart (e) {
    if (this._isAndroid()) {
      this._frameDOMEl.removeEventListener('scroll', this._handleAndroidScroll)
    }
    this._getSliderWidth()
  }

  _handleTouchEnd (e) {
    e.preventDefault()
    e.stopPropagation()

    const { currentIndex } = this.state
    const scrollLeft = this._frameDOMEl.scrollLeft
    const actualPosition = currentIndex * this._sliderWidth
    const direction = actualPosition < scrollLeft ? 1 : -1

    const pointForMovement = actualPosition + ((this._sliderWidth) / 3 * direction)
    const newIndex = currentIndex + direction
    const newPosition = newIndex * this._sliderWidth

    let left = actualPosition

    if (
      (direction === 1 && scrollLeft > pointForMovement) ||
      (direction === -1 && scrollLeft < pointForMovement)
    ) {
      left = newPosition
      this._updateCurrentIndex({ index: newIndex })
    }

    // nasty trick in order to handle the momentum scroll on Android
    if (this._isAndroid()) {
      this._ANDROID_lastScroll = scrollLeft
      this._ANDROID_nextScroll = left
      this._frameDOMEl.addEventListener('scroll', this._handleAndroidScroll)
    } else {
      moveScroll(this._frameDOMEl, left)
    }
  }

  _isAndroid () {
    return navigator.userAgent.toLowerCase().indexOf('android') > -1
  }

  _handleSlide ({direction}) {
    const { currentIndex } = this.state
    const newIndex = currentIndex + direction
    if (newIndex >= this._slides.length || newIndex < 0) return

    const left = newIndex * this._sliderWidth
    moveScroll(this._frameDOMEl, left)
    this._updateCurrentIndex({ index: newIndex })
    this.props.doAfterSlide({currentSlide: newIndex})
  }

  _handleResize () {
    const { currentIndex, showSlider } = this.state
    // handle resize only if we're showing the slider and we already have the frame DOM element
    if (showSlider && this._frameDOMEl) {
      this._getSliderWidth({ force: true })
      moveScroll(this._frameDOMEl, currentIndex * this._sliderWidth)
    }
  }

  _handleAndroidScroll (e) {
    const lastScroll = this._ANDROID_lastScroll
    const actualScroll = this._frameDOMEl.scrollLeft
    // check if that makes sense
    if (lastScroll > actualScroll) {
      this._elasticScrollState = -1
    } else if (lastScroll < actualScroll) {
      this._elasticScrollState = 1
    } else {
      this._elasticScrollState = 0
    }
    console.log(this._elasticScrollState)
    // this._frameDOMEl.scrollLeft = this._ANDROID_lastScroll
    // this._handleEndAndroidScroll()
    // console.log('scroll')
    // console.log(this._ANDROID_lastScroll)
    // console.log(this._frameDOMEl.scrollLeft)
  }

  _handleEndAndroidScroll () {
    this._frameDOMEl.removeEventListener('scroll', this._handleAndroidScroll)
    console.log('end scroll')
    console.log(this._ANDROID_nextScroll)
    moveScroll(this._frameDOMEl, this._ANDROID_nextScroll)
  }

  _updateCurrentIndex ({ index }) {
    this.setState({ currentIndex: index })
  }

  _setFrameRef (node) {
    this._frameDOMEl = node
  }

  render () {
    const { currentIndex, showSlider } = this.state
    const { classNameBase, lazyLoadConfig, lazyLoadSlides, showArrows } = this.props
    const { itemsToPreload } = lazyLoadConfig
    const numOfItems = this._slides.length

    return (
      <div
        className={this.props.classNameBase}
        onMouseEnter={this._getSliderWidth}
        onTouchEnd={this._handleTouchEnd}
        onTouchStart={this._handleTouchStart}
        ref={node => { this._sliderDOMEl = node }}>
        {showSlider && showArrows &&
          <Fragment>
            <Arrow
              className={`${classNameBase}-prev`}
              disabled={currentIndex === 0}
              onClick={this._handlePrev} />
            <Arrow
              className={`${classNameBase}-next`}
              disabled={currentIndex === numOfItems - 1}
              onClick={this._handleNext} />
          </Fragment>
        }
        {showSlider &&
          <Frame
            className={classNameBase}
            currentIndex={currentIndex}
            items={this._slides}
            itemsToPreload={itemsToPreload}
            lazyLoadSlides={lazyLoadSlides}
            setRef={this._setFrameRef}
            slidesKey={this._slidesKey}
          />
        }
      </div>
    )
  }
}

ReactSlidy.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  classNameBase: PropTypes.string,

  doAfterDestroy: PropTypes.func,
  doAfterSlide: PropTypes.func,
  doBeforeSlide: PropTypes.func,

  initialSlide: PropTypes.number,

  lazyLoadSlider: PropTypes.bool,
  lazyLoadSlides: PropTypes.bool,
  // Shape from https://github.com/jasonslyvia/react-lazyload/blob/master/src/index.jsx#L295
  lazyLoadConfig: PropTypes.shape({
    /* If lazyLoadSlides is true, then define the number of items that we will preload */
    itemsToPreload: PropTypes.number,
    /* Say if you want to preload a component even if it's 100px below the viewport (user have to scroll 100px more to see this component), you can set offset props to 100. On the other hand, if you want to delay loading a component even if it's top edge has already appeared at viewport, set offset to negative number. */
    offset: PropTypes.number,
    /* If lazy loading components inside a overflow container, set this to true. Also make sure a position property other than static has been set to your overflow container. */
    overflow: PropTypes.bool
  }),
  showArrows: PropTypes.bool
}

ReactSlidy.defaultProps = {
  classNameBase: 'react-Slidy',

  doAfterDestroy: NO_OP,
  doAfterSlide: NO_OP,
  doBeforeSlide: NO_OP,

  initialSlide: 0,

  lazyLoadSlider: true,
  lazyLoadSlides: true,
  lazyLoadConfig: {
    itemsToPreload: 2,
    offset: 150
  },
  showArrows: true
}
