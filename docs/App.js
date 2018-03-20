import React, { Component, Fragment } from 'react'

import Lowlight from 'react-lowlight'
import js from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/monokai-sublime.css'

import pages from './pages/*.js'

// Then register them with lowlight
Lowlight.registerLanguage('js', js)

export default class App extends Component {
  constructor (...args) {
    super(...args)
    this.state = { activeSection: pages[0] }
  }

  componentDidMount () {
    const hash = window.location.hash
    if (hash) {
      this.setState({ activeSection: hash.replace('#', '') })
    }
  }

  _changeActivatedSection (demo) {
    return (e) => {
      this.setState({ activeSection: demo })
    }
  }

  render () {
    const {activeSection} = this.state

    return (
      <Fragment>
        <nav>
          {Object.keys(pages).map(demo => (
            <a
              href={`#${demo}`}
              className={activeSection === demo ? 'active' : ''}
              onClick={this._changeActivatedSection(demo)}
              key={demo}
            >
              {demo}
            </a>
          ))}
        </nav>

        <section className='content'>
          {Object.keys(pages).map(demo => (
            <div key={demo} id={demo}>
              {pages[demo].demo}
            </div>
          ))}
        </section>

      </Fragment>
    )
  }
}
