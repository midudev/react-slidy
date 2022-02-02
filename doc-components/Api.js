import React from 'react'

// generated with react-docgen
const props = {
  ArrowLeft: {
    type: {name: 'elementType'},
    required: false,
    description: 'Component to be used as the left arrow for the slider'
  },
  ArrowRight: {
    type: {name: 'elementType'},
    required: false,
    description: 'Component to be used as the right arrow for the slider'
  },
  children: {
    type: {
      name: 'union',
      value: [{name: 'array'}, {name: 'object'}]
    },
    required: true,
    description: 'Children to be used as slides for the slider'
  },
  classNameBase: {
    type: {name: 'string'},
    required: false,
    description:
      'Class base to create all clases for elements. Styles might break if you modify it.',
    defaultValue: {value: "'react-Slidy'", computed: false}
  },
  doAfterDestroy: {
    type: {name: 'func'},
    required: false,
    description:
      'Function that will be executed AFTER destroying the slider. Useful for clean up stuff',
    defaultValue: {value: 'function noop() {}', computed: false}
  },
  doAfterInit: {
    type: {name: 'func'},
    required: false,
    description:
      'Function that will be executed AFTER initializing  the slider',
    defaultValue: {value: 'function noop() {}', computed: false}
  },
  doAfterSlide: {
    type: {name: 'func'},
    required: false,
    description:
      'Function that will be executed AFTER slide transition has ended',
    defaultValue: {value: 'function noop() {}', computed: false}
  },
  doBeforeSlide: {
    type: {name: 'func'},
    required: false,
    description: 'Function that will be executed BEFORE slide is happening',
    defaultValue: {value: 'function noop() {}', computed: false}
  },
  ease: {
    type: {name: 'string'},
    required: false,
    description: 'Ease mode to use on translations',
    defaultValue: {value: "'ease'", computed: false}
  },
  imageObjectFit: {
    type: {
      name: 'enum',
      value: [
        {value: "'cover'", computed: false},
        {value: "'contain'", computed: false}
      ]
    },
    required: false,
    description: 'Determine the object-fit property for the images'
  },
  infiniteLoop: {
    type: {name: 'bool'},
    required: false,
    description:
      'Indicates if the slider will start with the first slide once it ends',
    defaultValue: {value: 'false', computed: false}
  },
  itemsToPreload: {
    type: {name: 'number'},
    required: false,
    description: 'Determine the number of items that will be preloaded',
    defaultValue: {value: '1', computed: false}
  },
  initialSlide: {
    type: {name: 'number'},
    required: false,
    description: 'Determine the first slide to start with',
    defaultValue: {value: '0', computed: false}
  },
  keyboardNavigation: {
    type: {name: 'bool'},
    required: false,
    description: 'Activate navigation by keyboard',
    defaultValue: {value: 'false', computed: false}
  },
  lazyLoadSlider: {
    type: {name: 'bool'},
    required: false,
    description:
      'Determine if the slider will be lazy loaded using Intersection Observer',
    defaultValue: {value: 'true', computed: false}
  },
  lazyLoadConfig: {
    type: {
      name: 'shape',
      value: {
        offset: {
          name: 'number',
          description: 'Distance which the slider will be loaded',
          required: false
        }
      }
    },
    required: false,
    description:
      'Configuration for lazy loading. Only needed if lazyLoadSlider is true',
    defaultValue: {value: '{\r\n  offset: 150\r\n}', computed: false}
  },
  numOfSlides: {
    type: {name: 'number'},
    required: false,
    description: 'Number of slides to show at once',
    defaultValue: {value: '1', computed: false}
  },
  sanitize: {
    type: {name: 'bool'},
    required: false,
    description:
      'Determine if we want to sanitize the slides or take numberOfSlider directly',
    defaultValue: {value: 'true', computed: false}
  },
  slide: {
    type: {name: 'number'},
    required: false,
    description:
      'Change dynamically the slide number, perfect to use with dots',
    defaultValue: {value: '0', computed: false}
  },
  showArrows: {
    type: {name: 'bool'},
    required: false,
    description: 'Determine if arrows should be shown',
    defaultValue: {value: 'true', computed: false}
  },
  slideSpeed: {
    type: {name: 'number'},
    required: false,
    description: 'Determine the speed of the sliding animation',
    defaultValue: {value: '500', computed: false}
  },
  useFullWidth: {
    type: {name: 'bool'},
    required: false,
    description: 'Use the full width of the container for the image',
    defaultValue: {value: 'true', computed: false}
  },
  useFullHeight: {
    type: {name: 'bool'},
    required: false,
    description:
      'Use the full height of the container adding some styles to the elements',
    defaultValue: {value: 'false', computed: false}
  }
}

export default function Api() {
  const propsKeys = Object.keys(props)

  return (
    <>
      {propsKeys.map(propName => {
        const {defaultValue = {}, required, type, description} =
          props[propName] || {}
        const {value = undefined} = defaultValue
        if (typeof type === 'undefined') {
          console.warn(
            // eslint-disable-line
            'It seem that you might have a prop with a defaultValue but it does not exist as propType'
          )
          return
        }

        return (
          <div key={propName}>
            <strong>
              {propName}
              {required ? <small>* required</small> : null}
            </strong>
            <span>{type.name}</span>
            {value && <span className="default">default value: {value}</span>}
            {description && <p>{description}</p>}
          </div>
        )
      })}
      <style jsx>{`
        div {
          padding-bottom: 8px;
        }

        strong {
          font-weight: 600;
          font-size: 14px;
        }

        small {
          color: #555;
          margin-left: 4px;
          font-weight: 500;
          font-size: 12px;
        }

        span {
          color: #03f;
          font-size: 12px;
          margin-left: 8px;
          font-style: italic;
        }

        span.default {
          color: #555;
        }

        p {
          margin: 0 0 4px 0;
          font-size: 12px;
        }
      `}</style>
    </>
  )
}
