import React from 'react'
import AutoSuggestItem from './AutoSuggestItem'

import './AutoSuggestList.scss'

const AutoSuggestList = props => {
  const {
    activeSuggestion,
    highlightedSuggestions,
    handleOnClick,
    handleMouseMove,
    myRef
  } = props
  return (
    <ul className='autosuggest-list' role='listbox'>
      {highlightedSuggestions.map((suggestion, i) => {
        let isActive = false

        if (i === activeSuggestion) {
          isActive = true
        }
        return (
          <AutoSuggestItem
            isActive={isActive}
            handleOnClick={handleOnClick}
            handleMouseMove={handleMouseMove}
            suggestion={suggestion}
            key={`${suggestion}-${i}`}
            tabIndex={i}
            ref={isActive ? myRef : null}
          />
        )
      })}
    </ul>
  )
}

export default AutoSuggestList
