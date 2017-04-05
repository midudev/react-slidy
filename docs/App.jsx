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
  'with-other-components',
  'with-links'
]

const navButtonsContent = `
<a class="github-button" href="https://github.com/miduga/react-slidy" aria-label="React Slidy Repo">Repo</a>
<a class="github-button" href="https://github.com/miduga/react-slidy" data-icon="octicon-star" data-count-href="/miduga/react-slidy/stargazers" data-count-api="/repos/miduga/react-slidy#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star miduga/react-slidy on GitHub">Star</a>
<a class="github-button" href="https://github.com/miduga/react-slidy/issues" data-icon="octicon-issue-opened" data-count-api="/repos/miduga/react-slidy#open_issues_count" data-count-aria-label="# issues on GitHub" aria-label="Issue miduga/react-slidy on GitHub">Issue</a>
`

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

    const script = document.createElement('script')
    script.src = 'https://buttons.github.io/buttons.js'
    script.async = true

    document.body.appendChild(script)
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
        <nav className='mt2'>
          <h1 className='h1 mb0 mt0'>React Slidy</h1>
          <div
            className='nav-buttons mt1 mb2'
            dangerouslySetInnerHTML={{ __html: navButtonsContent }}
          />
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
