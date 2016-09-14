import React, { Component, PropTypes } from 'react'
import { lory } from 'lory.js'
import imagesLoaded from 'imagesloaded'

import ReactLoryList from './react-lory-list'

export default class ReactLory extends Component {

  constructor (...args) {
    super(...args)
    this.getSliderNode = this.getSliderNode.bind(this)
    this.handleAfterSlide = this.handleAfterSlide.bind(this)
    this.handleInit = this.handleInit.bind(this)
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

      this.sliderNode.addEventListener('after.lory.init', this.handleInit)
      this.sliderNode.addEventListener('after.lory.slide', this.handleAfterSlide)

      lory(this.sliderNode, {...this.props, ...classes})
    })
  }

  componentWillUnmount () {
    this.sliderNode.removeEventListener('after.lory.init', this.handleInit)
    this.sliderNode.removeEventListener('after.lory.slide', this.handleAfterSlide)
  }

  getClassName (element) {
    return `${this.props.classNameBase}-${element}`
  }

  getSliderNode (node) {
    this.sliderNode = node
  }

  handleAfterSlide (currentSlide) {
    this.props.doAfterSlide(currentSlide)
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
  doAfterSlide: PropTypes.func,
  ease: PropTypes.string,
  enableMouseEvents: PropTypes.bool,
  infinite: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number
  ]),
  rewind: PropTypes.bool,
  rewindSpeed: PropTypes.number,
  slideSpeed: PropTypes.number,
  slidesToScroll: PropTypes.number,
  snapBackSpeed: PropTypes.number
}

ReactLory.defaultProps = {
  classNameBase: 'react-lory',
  doAfterSlide: () => {},
  ease: 'ease',
  enableMouseEvents: true,
  infinite: 1,
  rewind: false,
  rewindSpeed: 600,
  slideSpeed: 300,
  slidesToScroll: 1,
  snapBackSpeed: 200
}
