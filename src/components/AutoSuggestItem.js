import React from 'react'

import './AutoSuggestItem.scss'

const AutoSuggestItem = props => {
  const {
    handleOnClick,
    handleMouseMove,
    isActive,
    suggestion,
    tabIndex
  } = props

  return (
    <li
      className={`${
        isActive ? 'autosuggest-item--active' : ''
      } autosuggest-item`}
      onClick={handleOnClick}
      onMouseMove={handleMouseMove}
      tabIndex={tabIndex}
    >
      {suggestion}
    </li>
  )
}

export default AutoSuggestItem
