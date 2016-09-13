import React, { Component, PropTypes } from 'react'
import { lory } from 'lory.js'

export default class ReactLory extends Component {

  constructor (...args) {
    super(...args)
    this.getSliderNode = this.getSliderNode.bind(this)
  }

  componentDidMount () {
    const classes = {
      classNameFrame: this.getClassName('frame'),
      classNameSlideContainer: this.getClassName('slides'),
      classNamePrevCtrl: this.getClassName('prev'),
      classNameNextCtrl: this.getClassName('next')
    }

    lory(this.sliderNode, {...this.props, ...classes})
  }

  getClassName (element) {
    return `${this.props.classNameBase}-${element}`
  }

  getSliderNode (node) {
    this.sliderNode = node
  }

  render () {
    const { children, classNameBase } = this.props
    const listItems = Array.isArray(children) ? children : [children]

    return (
      <div ref={this.getSliderNode} className={classNameBase}>
        <div className={this.getClassName('frame')}>
          <ul className={this.getClassName('slides')}>
            {listItems.map((item, index) => (
              <li className={this.getClassName('item')} key={index}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
  /*
  return (
    <div className='sui-Multimedia'>
      {imagesList.map((image, index) => {
        const multimediaImage = <SuiMultimediaImage {...image} />

        const multimediaLazyLoad = (
          <SuiMultimediaLazyLoad>
            {multimediaImage}
          </SuiMultimediaLazyLoad>
        )

        const imageItem = lazyLoad ? multimediaLazyLoad : multimediaImage
        const imageBasicProps = {
          key: index,
          title: image.alt || '',
          className: 'sui-Multimedia-link'
        }

        const imageWrapper = image.link ? (
          <a
            {...imageBasicProps}
            href={image.link}
          >
            {imageItem}
          </a>
        ) : image.routerLink ? (
          <Link
            {...imageBasicProps}
            to={image.routerLink}
          >
            {imageItem}
          </Link>
          ) : (
          <div key={index}>
            {imageItem}
          </div>
          )
        return imageWrapper
      })}
    </div>
  ) */
}

ReactLory.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  slidesToScroll: PropTypes.number,
  enableMouseEvents: PropTypes.bool,
  infinite: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number
  ]),
  rewind: PropTypes.bool,
  slideSpeed: PropTypes.number,
  rewindSpeed: PropTypes.number,
  snapBackSpeed: PropTypes.number,
  ease: PropTypes.string,
  className: PropTypes.string,
  classNameBase: PropTypes.string,
  classNameFrame: PropTypes.string,
  classNameSlideContainer: PropTypes.string,
  classNamePrevCtrl: PropTypes.string,
  classNameNextCtrl: PropTypes.string
}

ReactLory.defaultProps = {
  slidesToScroll: 1,
  enableMouseEvents: true,
  infinite: 1,
  rewind: false,
  slideSpeed: 300,
  rewindSpeed: 600,
  snapBackSpeed: 200,
  ease: 'ease',
  classNameBase: 'react-lory',
  classNamePrevCtrl: 'react-lory-prev',
  classNameNextCtrl: 'react-lory-next'
}
