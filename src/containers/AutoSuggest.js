import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './AutoSuggest.scss'

class AutoSuggest extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      filteredSuggestions: []
    }
  }

  componentDidMount() {
    console.log(this.props)
  }

  render() {
    return (
      <div className='autosuggest'>
        <h1>AutoSuggest</h1>
        <input
          className='autosuggest--input'
          type='text'
          placeholder='start typing yo!'
          autoComplete={'off'}
        />
      </div>
    )
  }
}

export default AutoSuggest
