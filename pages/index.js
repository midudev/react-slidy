import React from 'react'
import IndexMDX from './index.mdx'
import CodeBlock from './_examples/CodeBlock'
import {MDXProvider} from '@mdx-js/react'

const components = {
  pre: props => <div {...props} />,
  code: CodeBlock
}

export default () => (
  <MDXProvider components={components}>
    <IndexMDX />
    <style jsx global>
      {`
        body {
          background-color: #fff;
          color: #000;
          font-family: system-ui, sans-serif;
          line-height: 1.5;
          margin: 0 auto;
          max-width: 1000px;
          padding: 16px;
        }

        pre {
          overflow: auto;
          max-width: 100%;
        }
      `}
    </style>
  </MDXProvider>
)
