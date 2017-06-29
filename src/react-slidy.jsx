import React, { Component, PropTypes as T } from 'react'
import ReactSlidySlider from './react-slidy-slider'
import Spinner from '@schibstedspain/sui-spinner'
import LazyLoad from 'react-lazyload'

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
  // Shape from https://github.com/jasonslyvia/react-lazyload/blob/master/src/index.jsx#L295
  lazyLoadConfig: T.shape({
    /* In the first round of render, LazyLoad will render a placeholder for your component if no placeholder is provided and measure if this component is visible. Set height properly will make LazyLoad calculate more precisely. The value can be number or string like '100%'. You can also use css to set the height of the placeholder instead of using height. */
    height: T.oneOfType([
      T.string,
      T.number
    ]),
    /* Say if you want to preload a component even if it's 100px below the viewport (user have to scroll 100px more to see this component), you can set offset props to 100. On the other hand, if you want to delay loading a component even if it's top edge has already appeared at viewport, set offset to negative number. */
    offset: T.number,
    /* Once the lazy loaded component is loaded, do not detect scroll/resize event anymore. Useful for images or simple components. */
    once: T.bool,
    /* If lazy loading components inside a overflow container, set this to true. Also make sure a position property other than static has been set to your overflow container. */
    overflow: T.bool
  }),
  tailArrowClass: T.string
}

ReactSlidy.defaultProps = {
  classNameBase: 'react-Slidy',
  lazyLoadSlider: true,
  lazyLoadConfig: {
    height: 150,
    once: true,
    offset: 150
  },
  tailArrowClass: 'react-Slidy-arrow--disabled'
}
