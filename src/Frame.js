import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class Frame extends Component {
  constructor (props) {
    super(props)

    this._classNameFrame = `${props.className}-frame`
    this._classNameSlide = `${props.className}-slide`

    this._renderEmptySlide = this._renderEmptySlide.bind(this)
    this._renderItem = this._renderItem.bind(this)

    this.state = {
      slides: this._createInitialSlides(props)
    }
  }

  componentWillReceiveProps ({ currentIndex, items }) {
    if (currentIndex !== this.props.currentIndex) {
      const direction = currentIndex > this.props.currentIndex ? 1 : -1
      this.setState(prevState => {
        const { slides } = prevState
        const newSlides = slides.map((slide, index) => {
          if (index !== currentIndex + direction) {
            return slide
          }

          return this._renderItem(items[index], index)
        })
        return { slides: newSlides }
      }, () => this.forceUpdate())
    }
  }

  _createInitialSlides ({ initialSlide = 0, items, itemsToPreload, lazyLoadSlides }) {
    if (lazyLoadSlides && itemsToPreload >= 0) {
      const numberOfSlides = items.length
      const point = initialSlide + itemsToPreload
      const slides = items.slice(0, point).map(this._renderItem)
      const placeholders = items.slice(point, numberOfSlides).map(this._renderEmptySlide)
      return slides.concat(placeholders)
    } else {
      return items.map(this._renderItem)
    }
  }

  _renderEmptySlide (item, index) {
    return this._renderItem(null, `empty${index}`)
  }

  _renderItem (item, index) {
    return (
      <li
        className={this._classNameSlide}
        key={`${this.props.slidesKey}${index}`}>
        {item}
      </li>
    )
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { setRef } = this.props

    return (
      <ul className={this._classNameFrame} ref={setRef}>
        {this.state.slides}
      </ul>
    )
  }
}

Frame.propTypes = {
  className: PropTypes.string,
  currentIndex: PropTypes.number,
  items: PropTypes.array,
  itemsToPreload: PropTypes.number,
  lazyLoadSlides: PropTypes.bool,
  setRef: PropTypes.func,
  slidesKey: PropTypes.number
}
