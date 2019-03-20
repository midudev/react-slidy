/* eslint-disable react/prop-types */
import React, {Fragment, useEffect, useRef, useState} from 'react'
import slidy from './slidy'
function noop() {}

function convertToArrayFrom(children) {
  return Array.isArray(children) ? children : [children]
}

function getItemsToRender(index, maxIndex, items, itemsToPreload) {
  const preload = index > 0 ? itemsToPreload + 1 : itemsToPreload
  return items.slice(0, maxIndex + preload)
}

function destroySlider(slidyInstance, doAfterDestroy) {
  slidyInstance && slidyInstance.clean() && slidyInstance.destroy()
  doAfterDestroy()
}

function renderItem(item, index) {
  return <li key={index}>{item}</li>
}

export default function ReactSlidySlider({
  classNameBase,
  children,
  ease,
  doAfterDestroy,
  doAfterSlide,
  doBeforeSlide,
  initialSlide,
  itemsToPreload,
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

  useEffect(function() {
    const slidyInstance = slidy(sliderContainerDOMEl.current, {
      ease,
      doAfterSlide,
      doBeforeSlide,
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
    return () => destroySlider(slidyInstance, doAfterDestroy)
  }, [])

  useEffect(function() {
    slidyInstance && slidyInstance.updateItems(items.length)
  })

  const itemsToRender = getItemsToRender(index, maxIndex, items, itemsToPreload)

  return (
    <Fragment>
      {showArrows && (
        <Fragment>
          <span
            className={`${classNameBase}-prev`}
            disabled={index === 0}
            onClick={slidyInstance.prev}
          />
          <span
            className={`${classNameBase}-next`}
            disabled={index === items.length - 1}
            onClick={slidyInstance.next}
          />
        </Fragment>
      )}
      <div ref={sliderContainerDOMEl}>
        <ul ref={slidesDOMEl}>{itemsToRender.map(renderItem)}</ul>
      </div>
    </Fragment>
  )
}
