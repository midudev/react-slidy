import React, { Component, PropTypes } from 'react'
import ReactLorySlider from './react-lory-slider'
import Spinner from '@schibstedspain/sui-spinner'
import LazyLoad from 'react-lazy-load'

const spinnerConfig = {
  size: 20,
  thickness: 2,
  type: 'circle'
}

const lazyLoadOffsetVerical = 500

export default class ReactLory extends Component {
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
          <ReactLorySlider {...this.props}>
            {this.props.children}
          </ReactLorySlider>
        </LazyLoad>
      </div>
    )
  }
}

ReactLory.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  classNameBase: PropTypes.string
}

ReactLory.defaultProps = {
  classNameBase: 'react-Slidy'
}
