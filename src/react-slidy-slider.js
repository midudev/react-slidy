/* eslint-disable react/prop-types */
import React, {useEffect, useRef, useState} from 'react'
import slidy from './slidy'

function noop(_) {}

function convertToArrayFrom(children) {
  return Array.isArray(children) ? children : [children]
}

function getItemsToRender({
  index,
  maxIndex,
  items: originalItems,
  itemsToPreload,
  numOfSlides,
  infiniteLoop
}) {
  const preload = Math.max(itemsToPreload, numOfSlides)
  // If the slider is infinite, is needed clone the first and the last element
  const items = infiniteLoop
    ? [
        originalItems[originalItems.length - 1],
        ...originalItems,
        originalItems[0]
      ]
    : originalItems
  if (index >= items.length - numOfSlides) {
    const addNewItems =
      items.length > numOfSlides ? items.slice(0, numOfSlides - 1) : []
    return [...items.slice(0, maxIndex + preload), ...addNewItems]
  } else {
    return items.slice(0, maxIndex + preload)
  }
}

function destroySlider(slidyInstance, doAfterDestroy) {
  slidyInstance && slidyInstance.clean() && slidyInstance.destroy()
  doAfterDestroy()
}

const renderItem = numOfSlides => (item, index) => {
  const inlineStyle = numOfSlides !== 1 ? {width: `${100 / numOfSlides}%`} : {}
  return (
    <li key={index} style={inlineStyle}>
      {item}
    </li>
  )
}

export default function ReactSlidySlider({
  ArrowLeft,
  ArrowRight,
  children,
  classNameBase,
  doAfterDestroy,
  doAfterInit,
  doAfterSlide,
  doBeforeSlide,
  ease,
  infiniteLoop,
  initialSlide,
  itemsToPreload,
  keyboardNavigation,
  numOfSlides,
  rewindLoop,
  showArrows,
  slide,
  slideSpeed
}) {
  const [slidyInstance, setSlidyInstance] = useState({
    goTo: noop,
    next: noop,
    prev: noop,
    updateItems: noop
  })
  const [index, setIndex] = useState(initialSlide)
  const [maxIndex, setMaxIndex] = useState(initialSlide)
  const sliderContainerDOMEl = useRef(null)
  const slidesDOMEl = useRef(null)

  const items = convertToArrayFrom(children)
  const isArrowsForced = infiniteLoop || rewindLoop

  useEffect(
    function() {
      slide !== index && slidyInstance.goTo(slide)
    },
    [slide] // eslint-disable-line
  )

  useEffect(
    function() {
      let handleKeyboard
      const slidyInstance = slidy(sliderContainerDOMEl.current, {
        ease,
        doAfterSlide,
        doBeforeSlide,
        numOfSlides,
        slideSpeed,
        rewindLoop,
        infiniteLoop,
        slidesDOMEl: slidesDOMEl.current,
        initialSlide: index,
        items: items.length,
        onNext: nextIndex => {
          setIndex(nextIndex)
          setMaxIndex(currentIndex =>
            nextIndex > currentIndex ? nextIndex : currentIndex
          )
          return nextIndex
        },
        onPrev: nextIndex => {
          setIndex(nextIndex)
          if (infiniteLoop && nextIndex === 0) setMaxIndex(items.length + 1)
          return nextIndex
        }
      })

      setSlidyInstance(slidyInstance)
      doAfterInit()

      if (keyboardNavigation) {
        handleKeyboard = e => {
          if (e.keyCode === 39) slidyInstance.next(e)
          else if (e.keyCode === 37) slidyInstance.prev(e)
        }
        document.addEventListener('keydown', handleKeyboard)
      }

      return () => {
        destroySlider(slidyInstance, doAfterDestroy)
        if (keyboardNavigation) {
          document.removeEventListener('keydown', handleKeyboard)
        }
      }
    },
    [] // eslint-disable-line
  )

  useEffect(function() {
    slidyInstance && slidyInstance.updateItems(items.length)
  })

  const itemsToRender = getItemsToRender({
    index,
    maxIndex,
    items,
    itemsToPreload,
    numOfSlides,
    infiniteLoop
  })

  const handlePrev = e => slidyInstance.prev(e)
  const handleNext = e => items.length > numOfSlides && slidyInstance.next(e)

  const renderLeftArrow = () => {
    const disabled = index === 0 && !isArrowsForced
    const props = {disabled, onClick: handlePrev}
    const leftArrowClasses = `${classNameBase}-arrow ${classNameBase}-arrowLeft`
    if (ArrowLeft) return <ArrowLeft {...props} className={leftArrowClasses} />

    return (
      <span
        aria-label="Previous"
        className={`${leftArrowClasses} ${classNameBase}-prev`}
        role="button"
        {...props}
      />
    )
  }
  const renderRightArrow = () => {
    const disabled =
      (items.length <= numOfSlides || index === items.length - 1) &&
      !isArrowsForced
    const props = {disabled, onClick: handleNext}
    const rightArrowClasses = `${classNameBase}-arrow ${classNameBase}-arrowRight`
    if (ArrowRight)
      return <ArrowRight {...props} className={rightArrowClasses} />

    return (
      <span
        aria-label="Next"
        className={`${rightArrowClasses} ${classNameBase}-next`}
        role="button"
        {...props}
      />
    )
  }

  return (
    <>
      {showArrows && (
        <>
          {renderLeftArrow()}
          {renderRightArrow()}
        </>
      )}
      <div ref={sliderContainerDOMEl}>
        <ul ref={slidesDOMEl}>{itemsToRender.map(renderItem(numOfSlides))}</ul>
      </div>
    </>
  )
}
