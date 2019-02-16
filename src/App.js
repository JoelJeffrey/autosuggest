import React, { Component } from 'react'
import AutoSuggest from './containers/AutoSuggest'
import suggestionsData from './suggestions-data.json'

import './App.css'

class App extends Component {
  render() {
    return (
      <div className='App'>
        <AutoSuggest suggestions={suggestionsData.suggestions} />
      </div>
    )
  }
}

export default App
