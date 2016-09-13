import React, { Component, PropTypes } from 'react'
import { lory } from 'lory.js'
import imagesLoaded from 'imagesloaded'

import ReactLoryList from './react-lory-list'

export default class ReactLory extends Component {

  constructor (...args) {
    super(...args)
    this.getSliderNode = this.getSliderNode.bind(this)
  }

  componentDidMount () {
    const classes = {
      classNameFrame: this.getClassName('frame'),
      classNameSlideContainer: this.getClassName('slides'),
      classNamePrevCtrl: this.getClassName('prev'),
      classNameNextCtrl: this.getClassName('next')
    }

    imagesLoaded(this.sliderNode, () => {
      this.sliderNode.addEventListener('after.lory.init', () => {
        this.sliderNode.classList.add(this.getClassName('-ready'))
      })

      lory(this.sliderNode, {...this.props, ...classes})
    })
  }

  getClassName (element) {
    return `${this.props.classNameBase}-${element}`
  }

  getSliderNode (node) {
    this.sliderNode = node
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
  slidesToScroll: PropTypes.number,
  enableMouseEvents: PropTypes.bool,
  infinite: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number
  ]),
  rewind: PropTypes.bool,
  slideSpeed: PropTypes.number,
  rewindSpeed: PropTypes.number,
  snapBackSpeed: PropTypes.number,
  ease: PropTypes.string,
  className: PropTypes.string,
  classNameBase: PropTypes.string
}

ReactLory.defaultProps = {
  slidesToScroll: 1,
  enableMouseEvents: true,
  infinite: 1,
  rewind: false,
  slideSpeed: 300,
  rewindSpeed: 600,
  snapBackSpeed: 200,
  ease: 'ease',
  classNameBase: 'react-lory'
}
