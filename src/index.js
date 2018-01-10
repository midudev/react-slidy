import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSlidySlider from './react-slidy-slider'
import Spinner from '@schibstedspain/sui-spinner-basic'

// if window is present, then we get the needed library
if (typeof window !== 'undefined' && window.document) {
  require('intersection-observer')
}

export default class ReactSlidy extends Component {
  constructor (props) {
    super(props)
    this.observer = null
    this.state = { showSlider: !this.props.lazyLoadSlider }
  }

  componentDidMount () {
    if (this.props.lazyLoadSlider) {
      if (!('IntersectionObserver' in window)) { // check we support IntersectionObserver
        this.setState({ showSlider: true })
        return
      }
      // if we support IntersectionObserver, let's use it
      const { offset = 0 } = this.props.lazyLoadConfig
      this.observer = new window.IntersectionObserver(this._handleIntersection, {
        rootMargin: `${offset}px 0px 0px`
      })
      this.observer.observe(this.node)
    }
  }

  componentDidCatch (error, errorInfo) {
    console.error({ error, errorInfo })
  }

  // as it's a slider, we don't want to re-render it and don't expect
  // to add new childrens to it, so we don't want unexpected behaviour
  // expect if we specify we have dynamicContent on it
  shouldComponentUpdate (nextProps, nextState) {
    return this.props.dynamicContent || nextState.showSlider !== this.state.showSlider
  }

  componentWillUnmount () {
    this.observer && this.observer.disconnect()
  }
  renderSlider () {
    return (
      <ReactSlidySlider {...this.props}>
        {this.props.children}
      </ReactSlidySlider>
    )
  }

  _handleIntersection = ([entry], observer) => {
    if (entry.isIntersecting || entry.intersectionRatio > 0) {
      observer.unobserve(entry.target)
      this.setState({ showSlider: true })
    }
  }

  render () {
    const { showSlider } = this.state

    return (
      <div
        className={this.props.classNameBase}
        ref={node => { this.node = node }}>
        <Spinner size='medium' />
        {
          showSlider && this.renderSlider()
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
  dynamicContent: PropTypes.bool,
  lazyLoadSlider: PropTypes.bool,
  // Shape from https://github.com/jasonslyvia/react-lazyload/blob/master/src/index.jsx#L295
  lazyLoadConfig: PropTypes.shape({
    /* Say if you want to preload a component even if it's 100px below the viewport (user have to scroll 100px more to see this component), you can set offset props to 100. On the other hand, if you want to delay loading a component even if it's top edge has already appeared at viewport, set offset to negative number. */
    offset: PropTypes.number,
    /* If lazy loading components inside a overflow container, set this to true. Also make sure a position property other than static has been set to your overflow container. */
    overflow: PropTypes.bool
  }),
  tailArrowClass: PropTypes.string
}

ReactSlidy.defaultProps = {
  classNameBase: 'react-Slidy',
  dynamicContent: false,
  lazyLoadSlider: true,
  lazyLoadConfig: {
    offset: 150
  },
  tailArrowClass: 'react-Slidy-arrow--disabled'
}
