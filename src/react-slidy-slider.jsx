import React, { Component, PropTypes } from 'react'
import ReactDOMServer from 'react-dom/server'

const NO_OP = () => {}

// in order to make react-slidy compatible with server-rendering
// by default slidy and imagesLoaded are empty functions
let slidy = NO_OP

// if window is present, then we get the needed library
if (typeof window !== 'undefined' && window.document) {
  slidy = require('./slidy/slidy.js').slidy
}

function getClassesName ({classNameBase}) {
  return {
    classNameFrame: `${classNameBase}-frame`,
    classNameItem: `${classNameBase}-item`,
    classNameNextCtrl: `${classNameBase}-next`,
    classNamePrevCtrl: `${classNameBase}-prev`,
    classNameSlideContainer: `${classNameBase}-slides`
  }
}

export default class ReactSlidySlider extends Component {
  constructor (props) {
    super(props)

    this.DOM = {}
    this.classes = getClassesName(props)
    this.slidyInstance = null
    this._setListItemsFromProps(props)

    this.sliderOptions = {
      ...this.classes,
      doAfterSlide: props.doAfterSlide,
      doBeforeSlide: props.doBeforeSlide,
      infinite: props.infinite,
      itemsPreloaded: props.itemsToPreload,
      rewindOnResize: props.rewindOnResize || props.infinite, // if infinite, rewindOnResize is always true
      tailArrowClass: props.tailArrowClass
    }
  }

  _initializeSlider () {
    // create the static markup for the slider
    const items = React.Children.map(this.listItems, child =>
      ReactDOMServer.renderToStaticMarkup(child)
    )
    // create the options for the slider
    const slidyOptions = {
      ...this.props,
      ...this.sliderOptions,
      items,
      frameDOMEl: this.DOM['frame']
    }
    // start slidy slider instance
    this.slidyInstance = slidy(this.DOM['slider'], slidyOptions)
  }

  _setListItemsFromProps ({ children }) {
    this.listItems = Array.isArray(children) ? children : [children]
  }

  _destroySlider () {
    this.slidyInstance && this.slidyInstance.destroy()
  }

  componentDidMount () {
    this._initializeSlider()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.dynamicContent) {
      const oldFirstItem = this.listItems[0].key
      this._setListItemsFromProps(nextProps)
      const hasDifferentContent = oldFirstItem !== this.listItems[0].key

      if (hasDifferentContent) {
        this._destroySlider()
        this._initializeSlider()
        this.forceUpdate()
      }
    }
  }

  componentWillUnmount () {
    this._destroySlider()
  }

  shouldComponentUpdate () {
    // as we want to improve performance, we're not relying on life cycle
    // to update our component, if we need, we rely on the dynamicContent prop
    // to force update our component and avoid showing same slider for dynamic content
    return false
  }

  getFrameNode = (node) => {
    this.DOM['frame'] = node
  }

  getSliderNode = (node) => {
    this.DOM['slider'] = node
  }

  nextSlider = (e) => {
    e.preventDefault()
    this.slidyInstance.next()
  }

  prevSlider = (e) => {
    e.preventDefault()
    this.slidyInstance.prev()
  }

  renderItem = (item, index) => {
    return (
      <li key={index} className={this.sliderOptions.classNameItem}>
        {item}
      </li>
    )
  }

  renderItems () {
    return this.listItems.slice(0, this.props.itemsToPreload).map(this.renderItem)
  }

  render () {
    const { showArrows } = this.props

    return (
      <div ref={this.getSliderNode}>
        <div
          className={this.sliderOptions.classNameFrame}
          ref={this.getFrameNode}
        >
          {showArrows &&
            <span
              className={this.classes.classNamePrevCtrl}
              onClick={this.prevSlider}
            />
          }
          {showArrows &&
            <span
              className={this.classes.classNameNextCtrl}
              onClick={this.nextSlider} />
          }
          <ul className={this.sliderOptions.classNameSlideContainer}>
            {this.renderItems()}
          </ul>
        </div>
      </div>
    )
  }
}

ReactSlidySlider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  classNameBase: PropTypes.string,
  dynamicContent: PropTypes.bool,
  doAfterSlide: PropTypes.func,
  doBeforeSlide: PropTypes.func,
  ease: PropTypes.string,
  infinite: PropTypes.bool,
  itemsToPreload: PropTypes.number,
  onReady: PropTypes.func,
  rewind: PropTypes.bool,
  rewindOnResize: PropTypes.bool,
  rewindSpeed: PropTypes.number,
  showArrows: PropTypes.bool,
  slideSpeed: PropTypes.number,
  snapBackSpeed: PropTypes.number,
  tailArrowClass: PropTypes.string
}

ReactSlidySlider.defaultProps = {
  doAfterSlide: NO_OP,
  doBeforeSlide: NO_OP,
  ease: 'ease',
  infinite: false,
  itemsToPreload: 1,
  onReady: NO_OP,
  rewind: false,
  rewindOnResize: false,
  rewindSpeed: 500,
  showArrows: true,
  slideSpeed: 500,
  snapBackSpeed: 500
}
