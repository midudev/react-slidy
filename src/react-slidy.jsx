import React, { Component, PropTypes } from 'react'
import ReactSlidySlider from './react-slidy-slider'
import Spinner from '@schibstedspain/sui-spinner'
import LazyLoad from 'react-lazy-load'

const spinnerConfig = {
  size: 20,
  thickness: 2,
  type: 'circle'
}

export default class ReactSlidy extends Component {
  // as it's a slider, we don't want to re-render it and don't expect
  // to add new childrens to it, so we don't want unexpected behaviour
  shouldComponentUpdate () {
    return false
  }

  renderSlider () {
    return (
      <ReactSlidySlider {...this.props}>
        {this.props.children}
      </ReactSlidySlider>
    )
  }

  renderSliderWithLazyLoad () {
    return (
      <LazyLoad {...this.props.lazyLoadConfig}>
        {this.renderSlider()}
      </LazyLoad>
    )
  }

  render () {
    const { lazyLoadSlider } = this.props

    return (
      <div className={this.props.classNameBase}>
        <Spinner {...spinnerConfig} />
        {
          lazyLoadSlider
          ? this.renderSliderWithLazyLoad()
          : this.renderSlider()
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
  lazyLoadSlider: PropTypes.bool,
  // Shape from https://github.com/loktar00/react-lazy-load/blob/master/src/LazyLoad.jsx#L121
  lazyLoadConfig: PropTypes.shape({
    className: PropTypes.string,
    debounce: PropTypes.bool,
    elementType: PropTypes.string,
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    offset: PropTypes.number,
    offsetBottom: PropTypes.number,
    offsetHorizontal: PropTypes.number,
    offsetLeft: PropTypes.number,
    offsetRight: PropTypes.number,
    offsetTop: PropTypes.number,
    offsetVertical: PropTypes.number,
    threshold: PropTypes.number,
    throttle: PropTypes.number,
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    onContentVisible: PropTypes.func
  })
}

ReactSlidy.defaultProps = {
  classNameBase: 'react-Slidy',
  lazyLoadSlider: true,
  lazyLoadConfig: {
    offsetVertical: 500
  }
}
