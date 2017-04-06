import React, { Component, PropTypes as T } from 'react'
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
  children: T.oneOfType([
    T.array,
    T.object
  ]).isRequired,
  classNameBase: T.string,
  lazyLoadSlider: T.bool,
  // Shape from https://github.com/loktar00/react-lazy-load/blob/master/src/LazyLoad.jsx#L121
  lazyLoadConfig: T.shape({
    className: T.string,
    debounce: T.bool,
    elementType: T.string,
    height: T.oneOfType([
      T.string,
      T.number
    ]),
    offset: T.number,
    offsetBottom: T.number,
    offsetHorizontal: T.number,
    offsetLeft: T.number,
    offsetRight: T.number,
    offsetTop: T.number,
    offsetVertical: T.number,
    tailArrowClass: T.string,
    threshold: T.number,
    throttle: T.number,
    width: T.oneOfType([
      T.string,
      T.number
    ]),
    onContentVisible: T.func
  })
}

ReactSlidy.defaultProps = {
  classNameBase: 'react-Slidy',
  lazyLoadSlider: true,
  lazyLoadConfig: {
    offsetVertical: 500
  }
}
