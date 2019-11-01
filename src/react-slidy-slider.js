/* eslint-disable react/prop-types */
import React, {useEffect, useRef, useState} from 'react'
import slidy from './slidy'

function noop() {}

function convertToArrayFrom(children) {
  return Array.isArray(children) ? children : [children]
}

function getItemsToRender({
  index,
  maxIndex,
  items,
  itemsToPreload,
  numOfSlides
}) {
  const preload = Math.max(itemsToPreload, numOfSlides)
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

const renderItem = (numOfSlides, classNameToAttach) => (item, index) => {
  const inlineStyle = numOfSlides !== 1 ? {width: `${100 / numOfSlides}%`} : {}
  return (
    <li className={classNameToAttach} key={index} style={inlineStyle}>
      {item}
    </li>
  )
}

export default function ReactSlidySlider({
  children,
  classNameToAttach,
  classNameBase,
  doAfterDestroy,
  doAfterInit,
  doAfterSlide,
  doBeforeSlide,
  ease,
  initialSlide,
  itemsToPreload,
  keyboardNavigation,
  numOfSlides,
  showArrows,
  slideSpeed
}) {
  const [slidyInstance, setSlidyInstance] = useState({
    next: noop,
    prev: noop,
    updateItems: noop
  })
  const [index, setIndex] = useState(initialSlide)
  const [maxIndex, setMaxIndex] = useState(initialSlide)
  const sliderContainerDOMEl = useRef(null)
  const slidesDOMEl = useRef(null)

  const items = convertToArrayFrom(children)

  useEffect(
    function() {
      let handleKeyboard
      const slidyInstance = slidy(sliderContainerDOMEl.current, {
        ease,
        doAfterSlide,
        doBeforeSlide,
        numOfSlides,
        slideSpeed,
        slidesDOMEl: slidesDOMEl.current,
        initialSlide: index,
        items: items.length,
        onNext: nextIndex => {
          setIndex(nextIndex)
          nextIndex > maxIndex && setMaxIndex(nextIndex)
          return nextIndex
        },
        onPrev: nextIndex => {
          setIndex(nextIndex)
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
    numOfSlides
  })

  return (
    <>
      {showArrows && (
        <>
          <span
            className={`${classNameBase}-prev`}
            disabled={index === 0}
            onClick={slidyInstance.prev}
          />
          <span
            className={`${classNameBase}-next`}
            disabled={items.length <= numOfSlides || index === items.length - 1}
            onClick={items.length > numOfSlides && slidyInstance.next}
          />
        </>
      )}
      <div className={classNameToAttach} ref={sliderContainerDOMEl}>
        <ul className={classNameToAttach} ref={slidesDOMEl}>
          {itemsToRender.map(renderItem(numOfSlides, classNameToAttach))}
        </ul>
      </div>
    </>
  )
}
