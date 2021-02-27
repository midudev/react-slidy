const React = require('react')
const {default: ReactSlidy} = require('../src/index')
const {render, screen} = require('@testing-library/react')

describe('ReactSlidy', () => {
  test('renders without problems without lazyLoad', () => {
    render(
      <ReactSlidy lazyLoadSlider={false}>
        <span>slide 1</span>
        <span>slide 2</span>
        <span>slide 3</span>
        <span>slide 4</span>
      </ReactSlidy>
    )

    screen.getByText('slide 1')
  })

  test('renders without problems with lazyLoad', async () => {
    render(
      <ReactSlidy>
        <span>slide 1</span>
        <span>slide 2</span>
        <span>slide 3</span>
        <span>slide 4</span>
      </ReactSlidy>
    )

    await screen.findByText('slide 1')
  })
})
