import React, {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import ReactSlidySlider from './react-slidy-slider'

const ReactSlidy = props => {
  const [showSlider, setShowSlider] = useState(!props.lazyLoadSlider)
  const nodeEl = useRef(null)

  useEffect(function() {
    let observer

    if (props.lazyLoadSlider) {
      const initLazyLoadSlider = () => {
        // if we support IntersectionObserver, let's use it
        const {offset = 0} = props.lazyLoadConfig
        observer = new window.IntersectionObserver(handleIntersection, {
          rootMargin: `${offset}px 0px 0px`
        })
        observer.observe(nodeEl.current)
      }

      if (!('IntersectionObserver' in window)) {
        import('intersection-observer').then(initLazyLoadSlider)
      } else {
        initLazyLoadSlider()
      }
    }

    return () => observer && observer.disconnect()
  }, [])

  const handleIntersection = ([entry], observer) => {
    if (entry.isIntersecting || entry.intersectionRatio > 0) {
      observer.unobserve(entry.target)
      setShowSlider(true)
    }
  }

  return (
    <div className={props.classNameBase} ref={nodeEl}>
      {showSlider && (
        <ReactSlidySlider parentRef={nodeEl} {...props}>
          {props.children}
        </ReactSlidySlider>
      )}
    </div>
  )
}

ReactSlidy.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  classNameBase: PropTypes.string,
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
  lazyLoadSlider: true,
  lazyLoadConfig: {
    offset: 150
  },
  tailArrowClass: 'react-Slidy-arrow--disabled'
}

export default ReactSlidy
