import React, { Component, PropTypes } from 'react'
import ReactDOMServer from 'react-dom/server'

const NO_OP = () => {}
const DEFAULT_TAIL_ARROW_BEHAVIOR = 'dim'
const validTailArrows = [ 'hide', 'dim', 'show' ]

// in order to make react-slidy compatible with server-rendering
// by default slidy and imagesLoaded are empty functions
let slidy = NO_OP
let imagesLoaded = NO_OP

// if window is present, then we get the needed library
if (typeof (window) !== 'undefined' && window.document) {
  slidy = require('./slidy/slidy.js').slidy
  imagesLoaded = require('imagesloaded')
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

    this.state = { currentSlide: 0 }

    const sliderItems = React.Children.map(this.listItems, child =>
      ReactDOMServer.renderToStaticMarkup(child)
    )

    this.sliderOptions = {
      ...this.classes,
      items: sliderItems,
      doAfterSlide: this.handleAfterSlide,
      // fix if the user try to use a `true` value for infinite
      infinite: props.infinite === true ? 1 : props.infinite,
      // if infinite, rewindOnResize is always true
      rewindOnResize: props.rewindOnResize || props.infinite,
      tailArrows: validTailArrows.indexOf(props.tailArrows) === -1
          ? DEFAULT_TAIL_ARROW_BEHAVIOR
          : props.tailArrows
    }
  }

  componentDidMount () {
    // wait to load the images in order to start some stuff only when needed
    imagesLoaded(this.DOM['slider'], () => {
      const slidyOptions = {
        ...this.props,
        ...this.sliderOptions,
        frameDOMEl: this.DOM['frame']
      }
      // start slidy slider instance
      this.slidyInstance = slidy(this.DOM['slider'], slidyOptions)
    })
  }

  componentWillUnmount () {
    this.slidyInstance && this.slidyInstance.destroy()
  }

  getFrameNode = (node) => {
    this.DOM['frame'] = node
  }

  getSliderNode = (node) => {
    this.DOM['slider'] = node
  }

  handleAfterSlide = ({currentSlide}) => {
    this.setState({ currentSlide })
    this.props.doAfterSlide({currentSlide})
  }

  nextSlider = (e) => {
    e.preventDefault()
    this.slidyInstance.next()
  }

  prevSlider = (e) => {
    e.preventDefault()
    this.slidyInstance.prev()
  }

  renderItems () {
    return this.listItems.slice(0, 2).map((item, index) => (
      <li key={index} className={this.sliderOptions.classNameItem}>
        {item}
      </li>
    ))
  }

  _getShowArrows () {
    const { showArrows } = this.props
    if (showArrows !== true) { return {} }

    if (this.sliderOptions.infinite === 1) {
      return {
        leftArrow: this.classes.classNamePrevCtrl,
        rightArrow: this.classes.classNameNextCtrl
      }
    }

    let showArrowsConfig = {}
    if (this.state.currentSlide > 0 || this.sliderOptions.tailArrows === 'show') {
      showArrowsConfig.leftArrow = this.classes.classNamePrevCtrl
    } else if (this.sliderOptions.tailArrows === 'dim') {
      showArrowsConfig.leftArrow = `${this.classes.classNamePrevCtrl} react-Slidy--dimmed-arrow`
    }
    if (this.state.currentSlide < (this.sliderOptions.items.length - 1) || this.sliderOptions.tailArrows === 'show') {
      showArrowsConfig.rightArrow = this.classes.classNameNextCtrl
    } else if (this.sliderOptions.tailArrows === 'dim') {
      showArrowsConfig.rightArrow = `${this.classes.classNameNextCtrl} react-Slidy--dimmed-arrow`
    }
    return { showArrowsConfig }
  }

  render () {
    const { showArrowsConfig } = this._getShowArrows()

    return (
      <div ref={this.getSliderNode}>
        <div
          className={this.sliderOptions.classNameFrame}
          ref={this.getFrameNode}
        >
          {!!showArrowsConfig.leftArrow && <span className={showArrowsConfig.leftArrow} onClick={this.prevSlider} />}
          {!!showArrowsConfig.rightArrow && <span className={showArrowsConfig.rightArrow} onClick={this.nextSlider} />}
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
  ease: PropTypes.string,
  tailArrows: PropTypes.string,
  infinite: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number
  ]),
  onReady: PropTypes.func,
  rewind: PropTypes.bool,
  rewindOnResize: PropTypes.bool,
  rewindSpeed: PropTypes.number,
  showArrows: PropTypes.bool,
  slideSpeed: PropTypes.number,
  slidesToScroll: PropTypes.number,
  snapBackSpeed: PropTypes.number
}

ReactSlidySlider.defaultProps = {
  doAfterSlide: NO_OP,
  ease: 'ease',
  infinite: 1,
  onReady: NO_OP,
  rewind: false,
  rewindOnResize: false,
  rewindSpeed: 500,
  showArrows: true,
  slideSpeed: 500,
  slidesToScroll: 1,
  snapBackSpeed: 500,
  tailArrows: DEFAULT_TAIL_ARROW_BEHAVIOR
}
