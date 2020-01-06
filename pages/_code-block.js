import React, {useState} from 'react'
import Highlight, {defaultProps} from 'prism-react-renderer'
import PropTypes from 'prop-types'

const theme = {
  plain: {
    color: '#393A34',
    backgroundColor: '#f6f8fa'
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#999988',
        fontStyle: 'italic'
      }
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.7
      }
    },
    {
      types: ['string', 'attr-value'],
      style: {
        color: '#e3116c'
      }
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: '#393A34'
      }
    },
    {
      types: [
        'entity',
        'url',
        'symbol',
        'number',
        'boolean',
        'variable',
        'constant',
        'property',
        'regex',
        'inserted'
      ],
      style: {
        color: '#36acaa'
      }
    },
    {
      types: ['atrule', 'keyword', 'attr-name', 'selector'],
      style: {
        color: '#00a4db'
      }
    },
    {
      types: ['function', 'deleted', 'tag'],
      style: {
        color: '#d73a49'
      }
    },
    {
      types: ['function-variable'],
      style: {
        color: '#6f42c1'
      }
    },
    {
      types: ['tag', 'selector', 'keyword'],
      style: {
        color: '#00009f'
      }
    }
  ]
}

export default function CodeBlock({button, children, className = ''}) {
  const [show, setShow] = useState(!button)
  const language = className.replace(/language-/, '')

  if (!show)
    return (
      <>
        <button onClick={() => setShow(true)}>Show code</button>
        <style jsx>
          {`
            button {
              background: #03f;
              border: 0;
              color: #fff;
              cursor: pointer;
              float: right;
              padding: 8px;
            }

            button:hover {
              background: #03a;
            }
          `}
        </style>
      </>
    )

  return (
    <Highlight
      {...defaultProps}
      code={children}
      language={language}
      theme={theme}
    >
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <pre className={className} style={{...style, padding: '20px'}}>
          {tokens.slice(0, tokens.length - 1).map((line, i) => (
            <div key={i} {...getLineProps({line, key: i})}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({token, key})} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

CodeBlock.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string
}
