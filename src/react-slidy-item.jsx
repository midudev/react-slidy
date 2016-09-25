import React, { Component, PropTypes } from 'react'

export default class ReactSlidyItem extends Component {

  shouldComponentUpdate ({load}) {
    return load === true && this.props.load !== load
  }

  render () {
    return (
      <li className={this.props.className}>
        {this.props.children}
      </li>
    )
  }
}

ReactSlidyItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  load: PropTypes.bool
}
