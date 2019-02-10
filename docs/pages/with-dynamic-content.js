import React, {Component} from 'react'
import ReactSlidy from '../../dist/react-slidy'

class DynamicReactSlidyContent extends Component {
  state = {
    loadMore: false
  }

  render() {
    const {loadMore} = this.state

    return (
      <div>
        <button
          onClick={() => {
            this.setState({loadMore: true})
          }}
        >
          Change content
        </button>
        <ReactSlidy
          dynamicContent
          infinite={false}
          doAfterDestroy={() => {
            console.log('slider destroyed!')
          }}
          doAfterSlide={() => {
            this.setState({
              oh: 'test new props dont re-render withe same content'
            })
          }}
        >
          <img src={require('../img/beautiful_landscapes.jpg')} />
          <img src={require('../img/beautiful_landscapes_02.jpg')} />
          <img src={require('../img/beautiful_landscapes_03.jpg')} />
          {loadMore && <img src={require('../img/beautiful_landscapes.jpg')} />}
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
