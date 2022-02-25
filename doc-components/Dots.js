import React, {useState} from 'react'
import ReactSlidy from '../src/index.js'

const SLIDES = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg']

const createStyles = isActive => ({
  background: 'transparent',
  border: 0,
  color: isActive ? '#333' : '#ccc',
  cursor: 'pointer',
  fontSize: '48px'
})

const Dots = () => {
  const [actualSlide, setActualSlide] = useState(0)

  const updateSlide = ({currentSlide}) => {
    setActualSlide(currentSlide)
  }

  return (
    <>
      <ReactSlidy doAfterSlide={updateSlide} slide={actualSlide}>
        {SLIDES.map(src => (
          <img alt="" key={src} src={src} />
        ))}
      </ReactSlidy>
      <div style={{textAlign: 'center'}}>
        {SLIDES.map((_, index) => {
          return (
            <button
              key={index}
              style={createStyles(index === actualSlide)}
              onClick={() => updateSlide({currentSlide: index})}
            >
              &bull;
            </button>
          )
        })}
      </div>
    </>
  )
}

export default Dots
