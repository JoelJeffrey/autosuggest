import React from 'react'

import './AutoSuggestItem.scss'

const AutoSuggestItem = React.forwardRef((props, ref) => {
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
      ref={ref}
    >
      {suggestion}
    </li>
  )
})

export default AutoSuggestItem
