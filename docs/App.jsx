import React, { Component } from 'react'
import jsxToString from 'jsx-to-string'
import Tag from './Tag'

import Lowlight from 'react-lowlight'
import js from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/monokai-sublime.css'

// Then register them with lowlight
Lowlight.registerLanguage('js', js)

const pages = [
  'intro',
  'with-other-components'
]

const pagesComponents = pages.reduce((acc, page) => {
  acc[page] = require(`./pages/${page}.jsx`).demo
  return acc
}, {})

export default class App extends Component {
  constructor (...args) {
    super(...args)

    this.state = {
      pageToLoad: pages[0]
    }
  }

  componentDidMount () {
    const pageToLoad = window.localStorage.getItem('pageToLoad')
    if (pageToLoad && pages.includes(pageToLoad)) {
      this.setState({ pageToLoad })
    }
  }

  changeDemo (pageToLoad) {
    return () => {
      this.setState({ pageToLoad })
      window.localStorage.setItem('pageToLoad', pageToLoad)
    }
  }

  render () {
    const {pageToLoad} = this.state
    const pageComponent = pagesComponents[pageToLoad]

    return (
      <div>
        <nav>
          <h1 className='h1'>React Slidy</h1>
          {pages.map(demo => (
            <button
              className={pageToLoad === demo ? 'active' : ''}
              key={demo}
              onClick={this.changeDemo(demo)}
            >
              {demo}
            </button>
          ))}
        </nav>

        <section className='content'>
          <section className='usage'>
            <Tag inverted text='CODE' />
            <Lowlight
              language='js'
              value={jsxToString(pageComponent)}
            />
          </section>

          <section className='demo'>
            <Tag text='RESULT' />
            { pageComponent }
          </section>
        </section>

      </div>
    )
  }
}
