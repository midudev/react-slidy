/* eslint-disable react/prop-types */
import React, {Fragment, useEffect, useRef, useState} from 'react'
import slidy from './slidy'
function noop() {}

function convertToArrayFrom(children) {
  return Array.isArray(children) ? children : [children]
}

function checkIsPrevDisabled({index, infinite}) {
  return index === 0 && !infinite
}

function checkIsNextDisabled({index, items, infinite}) {
  return index === items.length - 1 && !infinite
}

function getItemsToRender({
  index,
  infinite,
  items,
  itemsToPreload,
  maxIndex,
  numOfSlides
}) {
  if (infinite) {
    if (index >= items.length - 1) {
      // is last item or after
      const preload = Math.max(itemsToPreload, numOfSlides)
      return [
        ...items.slice(-preload),
        ...items.slice(0, maxIndex + preload),
        ...items.slice(0, numOfSlides)
      ]
    } else if (index <= 0) {
      const preload = Math.max(itemsToPreload, numOfSlides, Math.abs(index))
      return [...items.slice(-preload), items.slice(0, maxIndex + preload)]
    } else {
      const preload = Math.max(itemsToPreload, numOfSlides)
      return [...items.slice(-preload), items.slice(0, maxIndex + preload)]
    }
  } else {
    const preload = Math.max(itemsToPreload, numOfSlides)
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
  classNameBase,
  children,
  ease,
  doAfterDestroy,
  doAfterInit,
  doAfterSlide,
  doBeforeSlide,
  infinite,
  initialSlide,
  itemsToPreload,
  keyboardNavigation,
  numOfSlides,
  slideSpeed,
  showArrows,
  tailArrowClass
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
        infinite,
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
    infinite,
    index,
    maxIndex,
    items,
    itemsToPreload,
    numOfSlides
  })

  return (
    <Fragment>
      {showArrows && (
        <Fragment>
          <span
            className={`${classNameBase}-prev`}
            disabled={checkIsPrevDisabled({index, infinite})}
            onClick={slidyInstance.prev}
          />
          <span
            className={`${classNameBase}-next`}
            disabled={checkIsNextDisabled({
              index,
              items,
              infinite
            })}
            onClick={slidyInstance.next}
          />
        </Fragment>
      )}
      <div ref={sliderContainerDOMEl}>
        <ul ref={slidesDOMEl}>{itemsToRender.map(renderItem(numOfSlides))}</ul>
      </div>
    </Fragment>
  )
}
