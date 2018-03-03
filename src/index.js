import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'just-debounce-it'

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
      showSlider: !this.props.lazyLoadSlider
    }

    this._currentIndex = 0
    this._frameDOMEl = undefined
    this._sliderDOMEl = undefined
    this._sliderWidth = 0
    this._slides = React.Children.toArray(this.props.children)

    this._getSliderWidth = this._getSliderWidth.bind(this)
    this._handleIntersection = this._handleIntersection.bind(this)
    this._handleNext = this._handleNext.bind(this)
    this._handlePrev = this._handlePrev.bind(this)
    this._handleResize = debounce(this._handleResize.bind(this), 200)
    this._handleSlide = this._handleSlide.bind(this)
    this._handleTouchEnd = this._handleTouchEnd.bind(this)
    this._renderItem = this._renderItem.bind(this)
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

  componentWillUnmount () {
    this.observer && this.observer.disconnect()
    window.removeEventListener('resize', this._handleResize)
  }

  _getSliderWidth ({ force = false }) {
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

  _handleTouchEnd (e) {
    const scrollLeft = this._frameDOMEl.scrollLeft
    const actualPosition = this._currentIndex * this._sliderWidth
    const direction = actualPosition < scrollLeft ? 1 : -1

    const pointForMovement = actualPosition + ((this._sliderWidth) / 3 * direction)
    const newIndex = this._currentIndex + direction
    const newPosition = actualPosition + (this._sliderWidth * direction)

    let left = actualPosition

    if (
      (direction === 1 && scrollLeft > pointForMovement) ||
      (direction === -1 && scrollLeft < pointForMovement)
    ) {
      left = newPosition
      this._currentIndex = newIndex
    }

    moveScroll(this._frameDOMEl, left)
  }

  _handleSlide ({direction}) {
    const newIndex = this._currentIndex + direction
    if (newIndex >= this._slides.length || newIndex < 0) return

    const left = newIndex * this._sliderWidth
    moveScroll(this._frameDOMEl, left)
    this._currentIndex = newIndex
  }

  _handleResize () {
    this._getSliderWidth({ force: true })
    moveScroll(this._frameDOMEl, this._currentIndex * this._sliderWidth)
  }

  _renderItem (item, index) {
    const { classNameBase } = this.props
    return (
      <li
        className={`${classNameBase}-slide`}
        key={`${this.dynamicContentIndex}${index}`}>
        {item}
      </li>
    )
  }

  _renderItems () {
    const { initialSlide, itemsToPreload } = this.props
    // return slides.slice(0, initialSlide + itemsToPreload).map(this._renderItem)
    return this._slides.map(this._renderItem)
  }

  render () {
    const { showSlider } = this.state
    const { classNameBase, showArrows } = this.props

    return (
      <div
        className={this.props.classNameBase}
        onMouseEnter={this._getSliderWidth}
        onTouchEnd={this._handleTouchEnd}
        onTouchStart={this._getSliderWidth}
        ref={node => { this._sliderDOMEl = node }}>
        {showArrows &&
          <button className={`${classNameBase}-prev`} onClick={this._handlePrev} />
        }
        {showArrows &&
          <button className={`${classNameBase}-next`} onClick={this._handleNext} />
        }
        <ul
          className={`${classNameBase}-frame`}
          ref={node => { this._frameDOMEl = node }}>
          {this._renderItems()}
        </ul>
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

  lazyLoadSlider: PropTypes.bool,
  // Shape from https://github.com/jasonslyvia/react-lazyload/blob/master/src/index.jsx#L295
  lazyLoadConfig: PropTypes.shape({
    /* Say if you want to preload a component even if it's 100px below the viewport (user have to scroll 100px more to see this component), you can set offset props to 100. On the other hand, if you want to delay loading a component even if it's top edge has already appeared at viewport, set offset to negative number. */
    offset: PropTypes.number,
    /* If lazy loading components inside a overflow container, set this to true. Also make sure a position property other than static has been set to your overflow container. */
    overflow: PropTypes.bool
  }),
  showArrows: PropTypes.bool,
  tailArrowClass: PropTypes.string
}

ReactSlidy.defaultProps = {
  classNameBase: 'react-Slidy',

  doAfterDestroy: NO_OP,
  doAfterSlide: NO_OP,
  doBeforeSlide: NO_OP,

  lazyLoadSlider: true,
  lazyLoadConfig: {
    offset: 150
  },
  showArrows: true,
  tailArrowClass: 'react-Slidy-arrow--disabled'
}
