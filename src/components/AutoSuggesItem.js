import React from 'react'

import './AutoSuggestItem.scss'

const AutoSuggestItem = props => {
  const { handleOnClick, suggestion } = props
  return (
    <li className='autosuggest-item' onClick={handleOnClick}>
      {suggestion}
    </li>
  )
}

export default AutoSuggestItem
