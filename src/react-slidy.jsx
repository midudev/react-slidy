import React, { Component, PropTypes } from 'react'
import ReactSlidySlider from './react-slidy-slider'
import Spinner from '@schibstedspain/sui-spinner'
import LazyLoad from 'react-lazy-load'

const spinnerConfig = {
  size: 20,
  thickness: 2,
  type: 'circle'
}

const lazyLoadOffsetVerical = 500

export default class ReactSlidy extends Component {
  // as it's a slider, we don't want to re-render it and don't expect
  // to add new childrens to it, so we don't want unexpected behaviour
  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <div className={this.props.classNameBase}>
        <Spinner {...spinnerConfig} />
        <LazyLoad offsetVertical={lazyLoadOffsetVerical}>
          <ReactSlidySlider {...this.props}>
            {this.props.children}
          </ReactSlidySlider>
        </LazyLoad>
      </div>
    )
  }
}

ReactSlidy.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  classNameBase: PropTypes.string
}

ReactSlidy.defaultProps = {
  classNameBase: 'react-Slidy'
}
