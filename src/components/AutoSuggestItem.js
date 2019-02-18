import React from 'react'

import './AutoSuggestItem.scss'

const AutoSuggestItem = props => {
  const { classNames, handleOnClick, isActive, suggestion, tabIndex } = props
  return (
    <li
      className={`${classNames} autosuggest-item`}
      onClick={handleOnClick}
      aria-selected={isActive}
      tabIndex={tabIndex}
    >
      {suggestion}
    </li>
  )
}

export default AutoSuggestItem
