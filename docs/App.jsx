import React, {Component} from 'react'
import pages from './pages/*.js'

const navButtonsContent = `
<a class="github-button" href="https://github.com/miduga/react-slidy" aria-label="React Slidy Repo">Repo</a>
<a class="github-button" href="https://github.com/miduga/react-slidy" data-icon="octicon-star" data-count-href="/miduga/react-slidy/stargazers" data-count-api="/repos/miduga/react-slidy#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star miduga/react-slidy on GitHub">Star</a>
<a class="github-button" href="https://github.com/miduga/react-slidy/issues" data-icon="octicon-issue-opened" data-count-api="/repos/miduga/react-slidy#open_issues_count" data-count-aria-label="# issues on GitHub" aria-label="Issue miduga/react-slidy on GitHub">Issue</a>
`

export default class App extends Component {
  state = {activeSection: pages[0]}

  componentDidMount() {
    const hash = window.location.hash
    if (hash) {
      this.setState({activeSection: hash.replace('#', '')})
    }

    const script = document.createElement('script')
    script.src = 'https://buttons.github.io/buttons.js'
    script.async = true

    document.body.appendChild(script)
  }

  _changeActivatedSection(demo) {
    return e => {
      this.setState({activeSection: demo})
    }
  }

  render() {
    const {activeSection} = this.state

    return (
      <div>
        <nav className="pt2">
          <h1 className="h1 mb0 mt0">React Slidy</h1>
          <div
            className="nav-buttons mt1 mb2"
            dangerouslySetInnerHTML={{__html: navButtonsContent}}
          />
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

        <section className="content">
          {Object.keys(pages).map(demo => (
            <div key={demo} id={demo}>
              {pages[demo].demo}
            </div>
          ))}
        </section>
      </div>
    )
  }
}
