import React, {Component} from 'react'
import ReactSlidy from '../../../src'

const images = [
  {
    src: 'https://loremflickr.com/640/359',
    alt: 'Bicing Old town Barcelona'
  },
  {
    src: 'https://loremflickr.com/640/358',
    alt: 'Morning rain'
  }
]

const images2 = [
  {
    src: 'https://loremflickr.com/640/357',
    alt: 'Train'
  },
  {
    src: 'https://loremflickr.com/640/356',
    alt: 'Barcelona rain'
  }
]

const Multimedia = ({alt, src}) => { // eslint-disable-line
  return <img className="img-multimedia" alt={alt} src={src} />
}

class DynamicReactSlidyContent extends Component {
  state = {
    images
  }

  render() {
    const {images: imagesFromState} = this.state
    const imagesToRender = imagesFromState.map((img, key) => (
      <Multimedia key={img.src} {...img} />
    ))
    console.log(imagesToRender)

    return (
      <div>
        <button
          onClick={() => {
            this.setState({images: [...this.state.images, ...images2]})
          }}
        >
          Add slides
        </button>
        <ReactSlidy
          dynamicContent
          doAfterDestroy={() => {
            console.log('slider destroyed!')
          }}
          doAfterSlide={() => {
            this.setState({
              oh: 'test new props dont re-render withe same content'
            })
          }}
        >
          {imagesToRender}
        </ReactSlidy>
      </div>
    )
  }
}

export const demo = (
  <div className="text-center">
    <h4 className="h4">you can change the content dynamically</h4>
    <DynamicReactSlidyContent />
  </div>
)
