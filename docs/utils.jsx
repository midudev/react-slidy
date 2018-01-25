import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { github } from 'react-syntax-highlighter/dist/styles'

const prettifyHTML = require('js-beautify').html

export const DisplayCode = ({ children }) => {
  return (
    <SyntaxHighlighter language='html' style={github} customStyle={{ padding: '1em' }} >
      {prettifyHTML(children)}
    </SyntaxHighlighter>
  )
}

DisplayCode.propTypes = {
  children: React.PropTypes.string
}
