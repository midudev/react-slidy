const {clampNumber, infiniteIndex, translate} = require('../src/slidy')

describe('clampNumber', () => {
  test('when a number that is less than min value is provided then the min value is returned', () => {
    const when = [
      {value: 2, minValue: 4, maxValue: 8, expected: 4},
      {value: -3, minValue: 0, maxValue: 4, expected: 0}
    ]

    when.forEach(({value, minValue, maxValue, expected}) => {
      expect(clampNumber(value, minValue, maxValue)).toBe(expected)
    })
  })

  test('when a number that is greater than max value is provided then the max value is returned', () => {
    expect(clampNumber(16, 4, 8)).toBe(8)
  })

  test('when a number that is greater than max value is provided then the max value is returned', () => {
    expect(clampNumber(7, 4, 8)).toBe(7)
  })
})

describe('infiniteIndex', () => {
  test('when a number that is less than 0 is provided then the end value - 1 is returned', () => {
    const when = [
      {value: -1, endValue: 4, expected: 3},
      {value: -3, endValue: 9, expected: 8}
    ]

    when.forEach(({value, endValue, expected}) => {
      expect(infiniteIndex(value, endValue)).toBe(expected)
    })
  })

  test('when a number that is greater than end value is provided then 0 is returned', () => {
    expect(infiniteIndex(12, 8)).toBe(0)
  })

  test('when a number that is between 0 and the end value is provided then the same value is returned', () => {
    const when = [
      {value: 0, endValue: 4, expected: 0},
      {value: 1, endValue: 9, expected: 1},
      {value: 5, endValue: 9, expected: 5}
    ]

    when.forEach(({value, endValue, expected}) => {
      expect(infiniteIndex(value, endValue)).toBe(expected)
    })
  })
})

describe('translate', () => {
  test('when you want to translate to the right, the next slide', () => {
    // when
    const to = 1
    const fineTuningPixels = -57
    const numberOfSlides = 1
    const percentage = 100 / numberOfSlides

    expect(translate(to, fineTuningPixels, percentage)).toBe(
      'translate3d(calc(-100% - -57px), 0, 0)'
    )
  })

  test('when you want to translate to the left, the previous slide', () => {
    // when
    const to = -1
    const fineTuningPixels = -57
    const numberOfSlides = 1
    const percentage = 100 / numberOfSlides

    expect(translate(to, fineTuningPixels, percentage)).toBe(
      'translate3d(calc(100% - -57px), 0, 0)'
    )
  })
})
