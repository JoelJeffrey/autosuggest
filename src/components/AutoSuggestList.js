import React, { Component } from 'react'
import AutoSuggestItem from './AutoSuggestItem'

import './AutoSuggestList.scss'

class AutoSuggestList extends Component {
  render() {
    const { activeSuggestion, filteredSuggestions, handleOnClick } = this.props
    return (
      <ul className='autosuggest-list' role='listbox'>
        {filteredSuggestions.map((suggestion, i) => {
          let isActive = false

          if (i === activeSuggestion) {
            isActive = true
          }
          return (
            <AutoSuggestItem
              isActive={isActive}
              handleOnClick={handleOnClick}
              suggestion={suggestion}
              key={`${suggestion}-${i}`}
              tabIndex={i}
            />
          )
        })}
      </ul>
    )
  }
}

export default AutoSuggestList
