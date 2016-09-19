import React, { Component, PropTypes } from 'react'
import ReactLorySlider from './react-lory-slider'
import Spinner from '@schibstedspain/sui-spinner'
import LazyLoad from 'react-lazy-load'

const spinnerType = 'circle'

export default class ReactLory extends Component {

  constructor (...args) {
    super(...args)

    this.hideSpinner = this.hideSpinner.bind(this)

    this.state = { loading: true }
  }

  hideSpinner () {
    this.setState({ loading: false })
  }

  render () {
    return (
      <div className={this.props.classNameBase}>
        {this.state.loading && <Spinner type={spinnerType} />}
        <LazyLoad offsetVertical={500}>
          <ReactLorySlider {...this.props} onReady={this.hideSpinner}>
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
  classNameBase: 'react-Lory'
}
