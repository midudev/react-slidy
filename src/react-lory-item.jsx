import React, { Component, PropTypes } from 'react'

export default class ReactLoryItem extends Component {

  shouldComponentUpdate (nextProps) {
    console.log(nextProps)
    return nextProps.load === true && this.props.load !== nextProps.load
  }

  render () {
    return (
      <li className={this.props.className}>{this.props.children}</li>
    )
  }
}

ReactLoryItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  load: PropTypes.bool
}
