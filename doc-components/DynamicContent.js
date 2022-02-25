import React, {useState} from 'react'
import ReactSlidy from '../src/index.js'
import Number from './Number.js'

const DynamicContent = () => {
  const [slides, setSlides] = useState([0])
  const slidesToRender = slides.map((_, index) => (
    <Number key={index} num={index} />
  ))

  return (
    <>
      <button onClick={() => setSlides([...slides, 0])}>Add one slide!</button>
      <ReactSlidy>{slidesToRender}</ReactSlidy>
    </>
  )
}

export default DynamicContent
