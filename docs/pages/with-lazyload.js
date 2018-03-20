import React, { Component } from 'react'
import ReactSlidy from '../../src'

import {images} from '../js/images'

class DynamicReactSlidyContent extends Component {
  render () {
    return (
      <ReactSlidy
        lazyLoadSlider
        lazyLoadSlides
        itemsToPreload={2}>
        {images}
      </ReactSlidy>
    )
  }
}

export const demo = (
  <div className='text-center'>
    <h4 className='h4'>you can change the content dynamically</h4>
    <DynamicReactSlidyContent />
  </div>
)
