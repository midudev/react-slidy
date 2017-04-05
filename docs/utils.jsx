import React, { PropTypes } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'

const prettifyHTML = require('js-beautify').html
import { github } from 'react-syntax-highlighter/dist/styles'


export const DisplayCode = ({code, heading, prettify}) => {
  return (
    <section>
      <h3 className='big mv'>{heading}</h3>
      <SyntaxHighlighter language='html' style={github} customStyle={{ padding: '1em' }} >
        { prettify ? prettifyHTML(code) : code }
      </SyntaxHighlighter>
    </section>
  )
}

DisplayCode.propTypes = {
  code: PropTypes.string,
  heading: PropTypes.string,
  prettify: PropTypes.bool
}

DisplayCode.defaultProps = {
  code: ''
}
