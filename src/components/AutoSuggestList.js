import React from 'react'
import PropTypes from 'prop-types'
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
            handleMouseMove={handleMouseMove}
            handleOnClick={handleOnClick}
            isActive={isActive}
            key={`${suggestion}-${i}`}
            ref={isActive ? myRef : null}
            suggestion={suggestion}
          />
        )
      })}
    </ul>
  )
}

AutoSuggestList.propTypes = {
  activeSuggestion: PropTypes.number,
  highlightedSuggestions: PropTypes.array.isRequired,
  handleOnClick: PropTypes.func.isRequired,
  handleMouseMove: PropTypes.func.isRequired,
  myRef: PropTypes.object
}

AutoSuggestList.defaultProps = {
  activeSuggestion: 0,
  myRef: null
}

export default AutoSuggestList
