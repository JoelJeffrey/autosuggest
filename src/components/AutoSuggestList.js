import React from 'react'
import AutoSuggestItem from './AutoSuggesItem'

import './AutoSuggestList.scss'

const AutoSuggestList = props => {
  const { filteredSuggestions, handleOnClick } = props

  return (
    <ul className='autosuggest-list'>
      {filteredSuggestions.map((suggestion, i) => {
        return (
          <AutoSuggestItem
            handleOnClick={handleOnClick}
            suggestion={suggestion}
            key={`${suggestion}-${i}`}
          />
        )
      })}
    </ul>
  )
}

export default AutoSuggestList
