import React, { Component, PropTypes } from 'react'
import ReactDOMServer from 'react-dom/server'

const NO_OP = () => {}

// in order to make react-slidy compatible with server-rendering
// by default slidy and imagesLoaded are empty functions
let slidy = NO_OP

// if window is present, then we get the needed library
if (window !== undefined && window.document) {
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

    const { children } = props

    this.DOM = {}
    this.classes = getClassesName(props)
    this.listItems = Array.isArray(children) ? children : [children]
    this.slidyInstance = null

    const sliderItems = React.Children.map(this.listItems, child =>
      ReactDOMServer.renderToStaticMarkup(child)
    )

    this.sliderOptions = {
      ...this.classes,
      items: sliderItems,
      itemsPreloaded: props.itemsToPreload,
      doAfterSlide: props.doAfterSlide,
      doBeforeSlide: props.doBeforeSlide,
      infinite: props.infinite,
      // if infinite, rewindOnResize is always true
      rewindOnResize: props.rewindOnResize || props.infinite,
      tailArrowClass: props.tailArrowClass
    }
  }

  componentDidMount () {
    // wait to load the images in order to start some stuff only when needed
    const slidyOptions = {
      ...this.props,
      ...this.sliderOptions,
      frameDOMEl: this.DOM['frame']
    }
    // start slidy slider instance
    this.slidyInstance = slidy(this.DOM['slider'], slidyOptions)
  }

  componentWillUnmount () {
    this.slidyInstance && this.slidyInstance.destroy()
  }

  shouldComponentUpdate (nextProps) {
    // as we want to improve performance, we're not relying on life cycle
    // to update our component
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
  doAfterSlide: PropTypes.func,
  doBeforeSlide: PropTypes.func,
  ease: PropTypes.string,
  infinite: PropTypes.bool,
  itemsToPreload: PropTypes.bool,
  onReady: PropTypes.func,
  rewind: PropTypes.bool,
  rewindOnResize: PropTypes.bool,
  rewindSpeed: PropTypes.number,
  showArrows: PropTypes.bool,
  slideSpeed: PropTypes.number,
  slidesToScroll: PropTypes.number,
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
  slidesToScroll: 1,
  snapBackSpeed: 500
}
