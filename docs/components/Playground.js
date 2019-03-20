import React from 'react'
import reactElementToJSXString from 'react-element-to-jsx-string'

export default function Playground ({children}) {
  return (
    <React.Fragment>
      {children}
      <code>
        {
          reactElementToJSXString(children)
        }
      </code>
    </React.Fragment>
  )
}