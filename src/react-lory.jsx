import React, { Component, PropTypes } from 'react'
import { lory } from 'lory.js'
import imagesLoaded from 'imagesloaded'

import ReactLoryList from './react-lory-list'

const EVENTS = {
  INIT: 'after.lory.init',
  AFTER_DESTROY: 'after.lory.destroy',
  AFTER_SLIDE: 'after.lory.slide'
}

export default class ReactLory extends Component {

  constructor (...args) {
    super(...args)
    this.getSliderNode = this.getSliderNode.bind(this)
    this.handleAfterSlide = this.handleAfterSlide.bind(this)
    this.handleDestroy = this.handleDestroy.bind(this)
    this.handleInit = this.handleInit.bind(this)
    this.loryInstance = null

    this.state = { currentSlide: 0 }
  }

  componentDidMount () {
    // wait to load the images in order to start some stuff only when needed
    imagesLoaded(this.sliderNode, () => {
      const classes = {
        classNameFrame: this.getClassName('frame'),
        classNameSlideContainer: this.getClassName('slides'),
        classNamePrevCtrl: this.getClassName('prev'),
        classNameNextCtrl: this.getClassName('next')
      }

      this.sliderNode.addEventListener(EVENTS.INIT, this.handleInit)
      this.sliderNode.addEventListener(EVENTS.AFTER_DESTROY, this.handleDestroy)
      this.sliderNode.addEventListener(EVENTS.AFTER_SLIDE, this.handleAfterSlide)
      this.loryInstance = lory(this.sliderNode, {...this.props, ...classes})
    })
  }

  componentWillUnmount () {
    this.sliderNode.removeEventListener(EVENTS.INIT, this.handleInit)
    this.sliderNode.removeEventListener(EVENTS.AFTER_SLIDE, this.handleAfterSlide)
    this.loryInstance.destroy()
    this.sliderNode.removeEventListener(EVENTS.AFTER_DESTROY, this.handleDestroy)
  }

  getClassName (element) {
    return `${this.props.classNameBase}-${element}`
  }

  getSliderNode (node) {
    this.sliderNode = node
  }

  handleAfterSlide (event) {
    const {detail} = event
    const currentSlide = detail && detail.currentSlide ? detail.currentSlide : 0
    this.setState({currentSlide})
    this.props.doAfterSlide({currentSlide, event})
  }

  handleDestroy (event) {
    this.props.doAfterDestroy({event})
  }

  handleInit () {
    this.sliderNode.classList.add(this.getClassName('-ready'))
  }

  render () {
    const { children, classNameBase } = this.props
    const listItems = Array.isArray(children) ? children : [children]

    return (
      <div ref={this.getSliderNode} className={classNameBase}>
        <div className={this.getClassName('frame')}>
          <ReactLoryList
            className={this.getClassName('slides')}
            classNameItem={this.getClassName('item')}
            currentSlide={this.state.currentSlide}
            lazyLoadConfig={this.props.lazyLoadConfig}
            items={listItems} />
        </div>
      </div>
    )
  }
}

ReactLory.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  className: PropTypes.string,
  classNameBase: PropTypes.string,
  doAfterDestroy: PropTypes.func,
  doAfterSlide: PropTypes.func,
  ease: PropTypes.string,
  enableMouseEvents: PropTypes.bool,
  infinite: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number
  ]),
  lazyLoadConfig: PropTypes.object,
  rewind: PropTypes.bool,
  rewindSpeed: PropTypes.number,
  slideSpeed: PropTypes.number,
  slidesToScroll: PropTypes.number,
  snapBackSpeed: PropTypes.number
}

ReactLory.defaultProps = {
  classNameBase: 'react-Lory',
  doAfterDestroy: () => {},
  doAfterSlide: () => {},
  ease: 'ease',
  enableMouseEvents: true,
  infinite: 1,
  lazyLoadConfig: {
    enabled: true,
    itemsOnLoad: 2,
    componentPlaceholder: <div />
  },
  rewind: false,
  rewindSpeed: 600,
  slideSpeed: 300,
  slidesToScroll: 1,
  snapBackSpeed: 200
}
