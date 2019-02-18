import React from 'react'
import PropTypes from 'prop-types'

import './AutoSuggestItem.scss'

const AutoSuggestItem = React.forwardRef((props, ref) => {
  const { handleMouseMove, handleOnClick, isActive, suggestion } = props

  return (
    <li
      className={`${
        isActive ? 'autosuggest-item--active' : ''
      } autosuggest-item`}
      onClick={handleOnClick}
      onMouseMove={handleMouseMove}
      ref={ref}
    >
      {suggestion}
    </li>
  )
})

AutoSuggestItem.propTypes = {
  handleMouseMove: PropTypes.func.isRequired,
  handleOnClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  suggestion: PropTypes.array.isRequired
}

export default AutoSuggestItem
