import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class Arrow extends Component {
  shouldComponentUpdate ({ disabled }) {
    return this.props.disabled !== disabled
  }

  render () {
    const { className, disabled, onClick } = this.props
    return (
      <button
        className={className}
        disabled={disabled}
        onClick={onClick}
      />
    )
  }
}

Arrow.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}
