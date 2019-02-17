import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AutoSuggestList from '../components/AutoSuggestList'

import './AutoSuggest.scss'

class AutoSuggest extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      filteredSuggestions: [],
      showSuggestions: false,
      value: ''
    }
  }

  handleOnChange = e => {
    const { suggestions } = this.props
    const value = e.currentTarget.value

    const filteredSuggestions = suggestions.filter(
      suggestion => suggestion.toLowerCase().indexOf(value.toLowerCase()) > -1
    )

    this.setState({
      filteredSuggestions,
      showSuggestions: true,
      value: value
    })
  }

  handleOnClick = e => {
    console.log(e.currentTarget.innerText)
    this.setState({
      value: e.currentTarget.innerText,
      showSuggestions: false
    })
  }

  render() {
    const { value, filteredSuggestions, showSuggestions } = this.state

    return (
      <div className='autosuggest'>
        <h1>AutoSuggest</h1>
        <div className='autosuggest--input-wrapper'>
          <input
            autoComplete={'off'}
            className='autosuggest--input'
            onChange={this.handleOnChange}
            placeholder='start typing yo!'
            type='text'
            value={value}
          />
          {showSuggestions &&
            value.length > 0 &&
            (filteredSuggestions.length > 0 ? (
              <AutoSuggestList
                handleOnClick={this.handleOnClick}
                filteredSuggestions={filteredSuggestions}
              />
            ) : (
              <div className='autosuggest--empty'>
                <span>No Suggestions found :(</span>
              </div>
            ))}
        </div>
      </div>
    )
  }
}

export default AutoSuggest
