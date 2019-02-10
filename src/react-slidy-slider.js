import React, {Component} from 'react'
import PropTypes from 'prop-types'

const NO_OP = () => {}

export default class ReactSlidySlider extends Component {
  containerEl = React.createRef()

  _destroySlider() {
    this.props.doAfterDestroy()
  }

  componentWillUnmount() {
    this._destroySlider()
  }

  nextSlider = e => {
    e.preventDefault()
    this.containerEl.current.scrollBy({left: 1, behavior: 'smooth'})
    this.props.doAfterSlide()
  }

  prevSlider = e => {
    e.preventDefault()
    this.containerEl.current.scrollBy({left: -1, behavior: 'smooth'})
    this.props.doBeforeSlide()
  }

  renderItems({classNameBase}) {
    const {children, initialSlide, itemsToPreload} = this.props
    console.log(React.Children.toArray(children))

    return React.Children.toArray(children).map(item => (
      <div className={`${classNameBase}-item`} key={item.key}>
        {item}
      </div>
    ))
  }

  render() {
    const {classNameBase, hideScrollBar, showArrows} = this.props

    return (
      <div className={`${classNameBase}-frame`}>
        {showArrows && (
          <span
            className={`${classNameBase}-arrow`}
            onClick={this.prevSlider}
          />
        )}
        {showArrows && (
          <span
            className={`${classNameBase}-arrow is-next-arrow`}
            onClick={this.nextSlider}
          />
        )}
        <div
          className={`${classNameBase}-slides ${
            hideScrollBar ? 'is-scrollbar-hidden' : ''
          }`}
          ref={this.containerEl}
        >
          {this.renderItems({classNameBase})}
        </div>
      </div>
    )
  }
}

ReactSlidySlider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  classNameBase: PropTypes.string,
  doAfterDestroy: PropTypes.func,
  doAfterSlide: PropTypes.func,
  doBeforeSlide: PropTypes.func,
  hideScrollBar: PropTypes.bool,
  infinite: PropTypes.bool,
  initialSlide: PropTypes.number,
  itemsToPreload: PropTypes.number,
  onReady: PropTypes.func,
  showArrows: PropTypes.bool,
  tailArrowClass: PropTypes.string
}

ReactSlidySlider.defaultProps = {
  doAfterDestroy: NO_OP,
  doAfterSlide: NO_OP,
  doBeforeSlide: NO_OP,
  infinite: false,
  initialSlide: 0,
  itemsToPreload: 1,
  onReady: NO_OP,
  showArrows: true
}
